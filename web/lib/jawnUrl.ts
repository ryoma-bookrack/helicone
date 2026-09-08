/** Jawn API base URL for self-hosted deployment. */
export function getJawnServiceUrl(): string {
  return (
    process.env.NEXT_PUBLIC_HELICONE_JAWN_SERVICE || "http://localhost:8585"
  ).replace(/\/$/, "");
}
