// @ts-check
import { defineConfig, devices } from "@playwright/test";
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
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* El baseURL NO va aca: cada proyecto declara el suyo, asi ningun spec
       hereda el sitio equivocado por descuido. */

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
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
