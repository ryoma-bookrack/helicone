import fs from "fs";
import path from "path";
import { I18N_NAMESPACES } from "./namespaces";

export function loadLocaleResources(
  locale: string,
): Record<string, Record<string, unknown>> {
  const resources: Record<string, Record<string, unknown>> = {};

  for (const ns of I18N_NAMESPACES) {
    const filePath = path.join(
      process.cwd(),
      "public/locales",
      locale,
      `${ns}.json`,
    );
    if (fs.existsSync(filePath)) {
      resources[ns] = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<
        string,
        unknown
      >;
    }
  }

  return resources;
}
