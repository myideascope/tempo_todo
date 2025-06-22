import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Google OAuth utilities
export const GOOGLE_OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  redirectUri: `${window.location.origin}/auth/callback`,
  scope:
    "https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/drive.file",
  responseType: "code",
  accessType: "offline",
  prompt: "consent",
};

export function generateGoogleAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CONFIG.clientId,
    redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
    scope: GOOGLE_OAUTH_CONFIG.scope,
    response_type: GOOGLE_OAUTH_CONFIG.responseType,
    access_type: GOOGLE_OAUTH_CONFIG.accessType,
    prompt: GOOGLE_OAUTH_CONFIG.prompt,
    state: generateRandomState(),
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export function generateRandomState(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export async function exchangeCodeForTokens(code: string): Promise<any> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: GOOGLE_OAUTH_CONFIG.clientId,
      client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for tokens");
  }

  return response.json();
}

export function storeTokens(tokens: any): void {
  localStorage.setItem("google_access_token", tokens.access_token);
  if (tokens.refresh_token) {
    localStorage.setItem("google_refresh_token", tokens.refresh_token);
  }
  localStorage.setItem(
    "google_token_expiry",
    (Date.now() + tokens.expires_in * 1000).toString(),
  );
}

export function getStoredTokens(): {
  accessToken: string | null;
  refreshToken: string | null;
  isExpired: boolean;
} {
  const accessToken = localStorage.getItem("google_access_token");
  const refreshToken = localStorage.getItem("google_refresh_token");
  const expiry = localStorage.getItem("google_token_expiry");

  const isExpired = expiry ? Date.now() > parseInt(expiry) : true;

  return { accessToken, refreshToken, isExpired };
}

export function clearStoredTokens(): void {
  localStorage.removeItem("google_access_token");
  localStorage.removeItem("google_refresh_token");
  localStorage.removeItem("google_token_expiry");
}
