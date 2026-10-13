import Ajv from "ajv/dist/2020";
import report from "../docs/report.schema.json";
import investigation from "../docs/investigation.schema.json";
import binary from "../docs/binary-analysis.schema.json";
const ajv = new Ajv({ strict: true });
ajv.addSchema(report);
const validators = {
  "2.0": ajv.getSchema(report.$id)!,
  "investigation-1.0": ajv.compile(investigation),
  "binary-analysis-1.0": ajv.compile(binary),
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
