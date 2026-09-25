import { headers } from "next/headers";
import { env } from "@/lib/env";

function stripSlash(url: string) {
  return url.replace(/\/$/, "");
}

function isLoopbackUrl(url: string) {
  try {
    const { hostname } = new URL(url);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

export async function getPublicAppUrl() {
  const configured = stripSlash(env.APP_URL);

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto =
    headerStore.get("x-forwarded-proto") ??
    (process.env.VERCEL ? "https" : "http");
  const fromRequest = host
    ? `${proto}://${host.split(",")[0]!.trim()}`
    : undefined;
  const fromVercel = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;

  if (configured && !isLoopbackUrl(configured)) return configured;
  if (fromRequest) return fromRequest;
  if (fromVercel) return fromVercel;
  return configured;
}
