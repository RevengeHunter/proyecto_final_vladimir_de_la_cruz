// @ts-check
import { defineConfig, devices } from "@playwright/test";
import os from "node:os";
import dotenv from "dotenv";
dotenv.config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

// Los specs de login y doble factor de the-internet: las dos carpetas
// tests/authentication y tests/authentication-two-factor.
const theInternetTests = "**/authentication*/**";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Un reintento en local: el sitio se cae cada tanto (Cloudflare 520) y asi
     esa corrida se recupera sola y queda marcada flaky, que distingue "fallo el
     sitio" de "la prueba esta mal". */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Carpeta de evidencias: solo guarda lo que se conserva por fallo */
  outputDir: "evidences",
  /* Borra allure-results antes de cada corrida: Allure no lo hace solo y los
     resultados viejos se mezclarian en el reporte. */
  globalSetup: "./clean-allure-results.js",
  reporter: [
    ["list"],
    ["json", { outputFile: "reportes/resultados.json" }],
    [
      "allure-playwright",
      {
        resultsDir: "allure-results",
        /* Oculta los pasos internos de hooks y fixtures: con 4 productos y sus
           modales, el arbol de pasos tapa lo que importa. */
        detail: false,
        /* El nombre del archivo como suite, dentro del proyecto. */
        suiteTitle: true,
        /* Solo datos publicos: las credenciales del .env NO van al reporte. */
        environmentInfo: {
          "Sistema de compras": process.env.BASE_URL ?? "(sin definir)",
          "Sistema de autenticacion":
            process.env.INTERNET_URL ?? "(sin definir)",
          Node: process.version,
          SO: `${os.type()} ${os.release()}`,
        },
        /* Agrupa los fallos por causa en la pestania Categories. */
        categories: [
          {
            name: "Cuenta duplicada en el sitio",
            messageRegex: ".*already exist.*",
            matchedStatuses: ["failed"],
          },
          {
            name: "Locator ambiguo (strict mode)",
            messageRegex: ".*strict mode violation.*",
            matchedStatuses: ["failed", "broken"],
          },
          {
            name: "Espera agotada",
            messageRegex: ".*Timeout.*exceeded.*",
            matchedStatuses: ["failed", "broken"],
          },
          {
            name: "Sitio caido o red",
            messageRegex: ".*(net::ERR|50\\d).*",
            matchedStatuses: ["failed", "broken"],
          },
        ],
      },
    ],
  ],

  use: {
    trace: "retain-on-failure" /* trace solo si falla o no termina */,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  /* Un grupo de proyectos por sitio: las dos carpetas de autenticacion corren
     contra the-internet y el resto contra automationexercise. Cada spec cae en
     un solo grupo, asi que nada corre dos veces.
     Los test.skip por browserName siguen funcionando: browserName es el
     navegador del proyecto (chromium/firefox/webkit), no su nombre. */
  projects: [
    {
      name: "automationexercise-chromium",
      use: { ...devices["Desktop Chrome"], baseURL: process.env.BASE_URL },
      testIgnore: theInternetTests,
    },

    {
      name: "automationexercise-firefox",
      use: { ...devices["Desktop Firefox"], baseURL: process.env.BASE_URL },
      testIgnore: theInternetTests,
    },

    {
      name: "automationexercise-webkit",
      use: { ...devices["Desktop Safari"], baseURL: process.env.BASE_URL },
      testIgnore: theInternetTests,
    },

    {
      name: "the-internet-chromium",
      use: { ...devices["Desktop Chrome"], baseURL: process.env.INTERNET_URL },
      testMatch: theInternetTests,
    },

    {
      name: "the-internet-firefox",
      use: { ...devices["Desktop Firefox"], baseURL: process.env.INTERNET_URL },
      testMatch: theInternetTests,
    },

    {
      name: "the-internet-webkit",
      use: { ...devices["Desktop Safari"], baseURL: process.env.INTERNET_URL },
      testMatch: theInternetTests,
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
