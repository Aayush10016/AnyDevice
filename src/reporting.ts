import { diagnostic, investigation, analysis } from "./generated/validators";
const validators = {
  "2.0": diagnostic,
  "investigation-1.0": investigation,
  "binary-analysis-1.0": analysis,
};
export function validateExport(content: string): void {
  if (new TextEncoder().encode(content).length > 20 * 1024 * 1024)
    throw new Error("Export exceeds 20 MiB");
  const value: unknown = JSON.parse(content);
  const version =
    value && typeof value === "object"
      ? (value as { schemaVersion?: string }).schemaVersion
      : undefined;
  const validate = validators[version as keyof typeof validators];
  if (!validate || !validate(value))
    throw new Error("Export does not conform to a supported AnyDevice schema");
}
