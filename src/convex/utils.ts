export const tryToGetWebhookSecretFromEnv = () => {
  return process.env.MYNTH_WEBHOOK_SECRET;
};

/**
 * Parse the signature header format: `t={timestamp},v1={signature}`
 */
function parseSignatureHeader(signatureHeader: string): {
  timestamp: string;
  signature: string;
} | null {
  const parts = signatureHeader.split(",");
  let timestamp: string | undefined;
  let signature: string | undefined;

  for (const part of parts) {
    const [key, value] = part.split("=");
    if (key === "t") {
      timestamp = value;
    } else if (key === "v1") {
      signature = value;
    }
  }

  if (!timestamp || !signature) {
    return null;
  }

  return { timestamp, signature };
}

export async function verifySignature(
  body: string,
  signatureHeader: string,
  secret: string,
): Promise<boolean> {
  // Parse the signature header to extract timestamp and signature
  const parsed = parseSignatureHeader(signatureHeader);
  if (!parsed) {
    return false;
  }

  const { timestamp, signature } = parsed;

  // Recreate the signed message: `{timestamp}.{body}` (same as signing)
  const message = `${timestamp}.${body}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  const expected = toHex(new Uint8Array(signed));

  return timingSafeEqual(expected, signature);
}

function toHex(bytes: Uint8Array): string {
  let hex = "";
  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, "0");
  }
  return hex;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
