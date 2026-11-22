/* Arma la tabla de metricas a partir de reportes/resultados.json, que escribe
   el reporter "json" en cada corrida.

   - Sin argumentos: la imprime por pantalla y no toca nada.
   - Con --write: la deja en el README entre los marcadores metricas:inicio y
     metricas:fin.

   Es CommonJS a proposito: lo corre Node directo y el package.json declara
   "type": "commonjs". El clean-allure-results.js de al lado usa import porque
   a ese lo transpila Playwright. */

const fs = require("node:fs");
const path = require("node:path");

const RESULTS_FILE = path.resolve("reportes", "resultados.json");
const README_FILE = path.resolve("README.md");
const MARK_START = "<!-- metricas:inicio -->";
const MARK_END = "<!-- metricas:fin -->";

function fail(mensaje) {
  console.error(`\n  ${mensaje}\n`);
  process.exit(1);
}

/* 204358 -> "3 min 24 s" */
function formatearDuracion(ms) {
  const segundos = Math.round(ms / 1000);
  const minutos = Math.floor(segundos / 60);
  const resto = segundos % 60;

  return minutos > 0
    ? `${minutos} min ${String(resto).padStart(2, "0")} s`
    : `${resto} s`;
}

function formatearFecha(iso) {
  const fecha = new Date(iso);
  const dosDigitos = (n) => String(n).padStart(2, "0");

  return (
    `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-` +
    `${dosDigitos(fecha.getDate())} ${dosDigitos(fecha.getHours())}:` +
    `${dosDigitos(fecha.getMinutes())}`
  );
}

/* El JSON anida suites dentro de suites; las pruebas estan en specs.tests. */
function recolectarPruebas(reporte) {
  const pruebas = [];

  const recorrer = (suite) => {
    (suite.suites || []).forEach(recorrer);
    (suite.specs || []).forEach((spec) =>
      (spec.tests || []).forEach((prueba) => pruebas.push(prueba)),
    );
  };

  (reporte.suites || []).forEach(recorrer);
  return pruebas;
}

function agruparPorProyecto(pruebas, ordenProyectos) {
  const porProyecto = new Map();

  for (const prueba of pruebas) {
    const nombre = prueba.projectName || "(sin proyecto)";

    if (!porProyecto.has(nombre)) {
      porProyecto.set(nombre, {
        nombre,
        total: 0,
        pasan: 0,
        fallan: 0,
        skip: 0,
        ms: 0,
      });
    }

    const fila = porProyecto.get(nombre);
    fila.total += 1;

    // status es el desenlace: expected / flaky / unexpected / skipped.
    if (prueba.status === "unexpected") fila.fallan += 1;
    else if (prueba.status === "skipped") fila.skip += 1;
    else fila.pasan += 1;

    fila.ms += (prueba.results || []).reduce(
      (suma, resultado) => suma + (resultado.duration || 0),
      0,
    );
  }

  // Se respeta el orden en que los proyectos estan en el config.
  return ordenProyectos
    .filter((nombre) => porProyecto.has(nombre))
    .map((nombre) => porProyecto.get(nombre))
    .concat(
      [...porProyecto.values()].filter(
        (fila) => !ordenProyectos.includes(fila.nombre),
      ),
    );
}

/* Celdas alineadas a la izquierda y rellenadas al ancho de la columna, que es
   como las deja prettier: asi el README no queda desformateado al escribirlo. */
function tablaMarkdown(encabezados, filas) {
  const anchos = encabezados.map((encabezado, i) =>
    Math.max(encabezado.length, ...filas.map((fila) => fila[i].length)),
  );
  const linea = (celdas) =>
    `| ${celdas.map((celda, i) => celda.padEnd(anchos[i])).join(" | ")} |`;

  return [
    linea(encabezados),
    `| ${anchos.map((ancho) => "-".repeat(ancho)).join(" | ")} |`,
    ...filas.map(linea),
  ].join("\n");
}

function construirMetricas(reporte) {
  const pruebas = recolectarPruebas(reporte);
  const configurados = (reporte.config.projects || []).map((p) => p.name);
  const filas = agruparPorProyecto(pruebas, configurados);

  const totales = filas.reduce(
    (acumulado, fila) => ({
      total: acumulado.total + fila.total,
      pasan: acumulado.pasan + fila.pasan,
      fallan: acumulado.fallan + fila.fallan,
      skip: acumulado.skip + fila.skip,
      ms: acumulado.ms + fila.ms,
    }),
    { total: 0, pasan: 0, fallan: 0, skip: 0, ms: 0 },
  );

  const encabezado =
    `> Corrida del ${formatearFecha(reporte.stats.startTime)} · ` +
    `**${totales.total} pruebas** en **${formatearDuracion(reporte.stats.duration)}** · ` +
    `${totales.pasan} pasan · ${totales.fallan} fallan · ${totales.skip} en skip` +
    (reporte.stats.flaky > 0
      ? ` · ${reporte.stats.flaky} inestables (pasaron al reintentar)`
      : "");

  const tabla = tablaMarkdown(
    ["Proyecto", "Pruebas", "Pasan", "Fallan", "Skip", "Suma de duraciones"],
    [
      ...filas.map((fila) => [
        `\`${fila.nombre}\``,
        String(fila.total),
        String(fila.pasan),
        String(fila.fallan),
        String(fila.skip),
        formatearDuracion(fila.ms),
      ]),
      [
        "**Total**",
        `**${totales.total}**`,
        `**${totales.pasan}**`,
        `**${totales.fallan}**`,
        `**${totales.skip}**`,
        `**${formatearDuracion(reporte.stats.duration)}**`,
      ],
    ],
  );

  return {
    markdown: `${encabezado}\n\n${tabla}`,
    configurados,
    presentes: filas.map((fila) => fila.nombre),
  };
}

function main() {
  const escribir = process.argv.includes("--write");

  if (!fs.existsSync(RESULTS_FILE)) {
    fail(
      "No hay reportes/resultados.json todavia.\n" +
        "  Corre la suite primero: npm test",
    );
  }

  const reporte = JSON.parse(fs.readFileSync(RESULTS_FILE, "utf8"));
  const { markdown, configurados, presentes } = construirMetricas(reporte);

  console.log(`\n${markdown}\n`);

  // La ultima corrida puede haber sido de un solo sistema: esos numeros no
  // representan a la suite y no tienen que terminar en el README.
  const parcial = presentes.length < configurados.length;

  if (parcial) {
    console.error(
      `  Corrida parcial: ${presentes.length} de ${configurados.length} proyectos.\n` +
        `  Faltan: ${configurados.filter((n) => !presentes.includes(n)).join(", ")}\n`,
    );
  }

  if (!escribir) return;

  if (parcial) {
    fail(
      "No se escribe el README con una corrida parcial.\n" +
        "  Corre la suite completa (npm test) y volve a intentar.",
    );
  }

  const readme = fs.readFileSync(README_FILE, "utf8");
  const inicio = readme.indexOf(MARK_START);
  const fin = readme.indexOf(MARK_END);

  if (inicio === -1 || fin === -1 || fin < inicio) {
    fail(
      `No encontre los marcadores en el README.\n` +
        `  Tienen que estar ${MARK_START} y ${MARK_END}, en ese orden.`,
    );
  }

  const actualizado =
    readme.slice(0, inicio + MARK_START.length) +
    `\n\n${markdown}\n\n` +
    readme.slice(fin);

  fs.writeFileSync(README_FILE, actualizado, "utf8");
  console.log("  Metricas escritas en README.md\n");
}

main();
