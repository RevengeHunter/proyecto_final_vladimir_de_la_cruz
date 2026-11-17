import { rmSync } from "node:fs";
import path from "node:path";

/* Allure NUNCA limpia allure-results: su writer solo hace mkdir, asi que los
   resultados se acumulan entre corridas. Sin esto, un reporte "de un sistema"
   sale con los tests del otro adentro y los fallos viejos reviven.

   Contrapartida: dos corridas seguidas no se suman. El reporte de toda la
   suite sale de una corrida de toda la suite.

   Ojo con la ruta: config.rootDir apunta a testDir (./tests), no a la carpeta
   del config, asi que no sirve de base. La carpeta se saca del propio reporter
   y se resuelve contra el cwd, que es la misma base que usa el writer de
   Allure para su resultsDir relativo. */
export default function cleanAllureResults(config) {
  const allureReporter = config.reporter.find(([name]) =>
    name.includes("allure-playwright"),
  );
  const resultsDir = allureReporter?.[1]?.resultsDir ?? "allure-results";

  rmSync(path.resolve(resultsDir), { recursive: true, force: true });
}
