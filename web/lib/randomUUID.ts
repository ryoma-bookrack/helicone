/**
 * UUID v4 that works on insecure HTTP LAN hosts.
 * Browsers only expose crypto.randomUUID() in secure contexts (HTTPS / localhost).
 */
export function randomUUID(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  if (c && typeof c.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    c.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
      "",
    );
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  // Last resort (non-crypto); still unique enough for UI session ids.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0;
    const v = ch === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Install crypto.randomUUID polyfill for third-party / unpatched call sites. */
export function ensureRandomUUIDPolyfill(): void {
  const c = globalThis.crypto as Crypto | undefined;
  if (!c || typeof c.randomUUID === "function") {
    return;
  }
  const gen = () => randomUUID();
  try {
    Object.defineProperty(c, "randomUUID", {
      value: gen,
      configurable: true,
      writable: true,
    });
  } catch {
    try {
      Object.defineProperty(Crypto.prototype, "randomUUID", {
        value: gen,
        configurable: true,
        writable: true,
      });
    } catch {
      // @ts-expect-error assign fallback when defineProperty is blocked
      c.randomUUID = gen;
    }
  }
}
