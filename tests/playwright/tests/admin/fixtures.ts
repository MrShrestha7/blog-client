import "dotenv/config";
import crypto from "crypto";
import fs from "fs";
import path from "path";

import { test as base, type BrowserContext, type Page } from "@playwright/test";

export const e2epassword = "superpassword";

// TODO: Implement seed
export async function seedData(...options: any[]) {}

const authFile = path.join(process.cwd(), ".auth", "user.json");

function base64UrlEncode(value: string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function signTestToken(payload: Record<string, unknown>) {
  const secret = process.env.JWT_SECRET || "secret";
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const claims = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
  };
  const body = base64UrlEncode(JSON.stringify(claims));
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${header}.${body}.${signature}`;
}

function ensureAuthStorage() {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const token = signTestToken({ role: "admin" });

  fs.writeFileSync(
    authFile,
    JSON.stringify(
      {
        cookies: [
          {
            name: "auth_token",
            value: token,
            domain: "localhost",
            secure: false,
            expires: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
            path: "/",
            httpOnly: true,
            sameSite: "Lax",
          },
        ],
      },
      null,
      2,
    ),
  );
}

type MyFixtures = {
  userPage: Page;
};

type AppOptions = {};

export function createOptions(options: Partial<AppOptions>) {
  return JSON.stringify({});
}

export async function setOptions(
  context: BrowserContext,
  options: Partial<AppOptions>,
) {
  await context.addCookies([
    {
      name: "options",
      url: process.env.VERCEL_URL,
      value: createOptions(options),
    },
  ]);
}

export * from "@playwright/test";
export const test = base.extend<MyFixtures>({
  userPage: async ({ browser }, use) => {
    ensureAuthStorage();
    const context = await browser.newContext({
      storageState: authFile,
    });
    const userPage = await context.newPage();
    await use(userPage);
    await context.close();
  },
});
