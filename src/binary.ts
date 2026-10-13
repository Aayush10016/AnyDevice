export const SAMPLE_LIMIT = 1024 * 1024;
export interface ByteAnnotation {
  offset: number;
  length: number;
  label: string;
}
export interface BinarySample {
  name: string;
  bytes: Uint8Array;
  sha256: string;
}
export async function readSample(file: File): Promise<BinarySample> {
  if (!/\.(bin|dat|raw)$/i.test(file.name))
    throw new Error(
      "Supported input: .bin, .dat or .raw byte samples. No capture or firmware format is decoded.",
    );
  if (!file.size || file.size > SAMPLE_LIMIT)
    throw new Error("Sample must contain 1 byte to 1 MiB.");
  const buffer = await file.arrayBuffer();
  if (buffer.byteLength !== file.size || buffer.byteLength > SAMPLE_LIMIT)
    throw new Error("Sample size changed during reading.");
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return {
    name: file.name,
    bytes: new Uint8Array(buffer),
    sha256: Array.from(new Uint8Array(digest), (b) =>
      b.toString(16).padStart(2, "0"),
    ).join(""),
  };
}
export function hexRows(bytes: Uint8Array, start: number): string {
  if (!Number.isInteger(start) || start < 0 || start >= bytes.length)
    throw new Error("Offset is outside this sample.");
  const lines: string[] = [];
  for (
    let offset = start;
    offset < Math.min(start + 256, bytes.length);
    offset += 16
  ) {
    const part = bytes.slice(offset, offset + 16);
    lines.push(
      `${offset.toString(16).padStart(8, "0")}  ${Array.from(part, (b) =>
        b.toString(16).padStart(2, "0"),
      )
        .join(" ")
        .padEnd(
          47,
          " ",
        )}  ${Array.from(part, (b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : ".")).join("")}`,
    );
  }
  return lines.join("\n");
}
export function annotate(
  bytes: Uint8Array,
  offset: number,
  length: number,
  label: string,
): ByteAnnotation {
  if (
    !Number.isInteger(offset) ||
    !Number.isInteger(length) ||
    offset < 0 ||
    length <= 0 ||
    offset + length > bytes.length
  )
    throw new Error("Annotation range is outside this sample.");
  if (!label.trim() || label.length > 2000)
    throw new Error("Enter a hypothesis label of at most 2000 characters.");
  return { offset, length, label };
}
export function binaryDiff(a: Uint8Array, b: Uint8Array) {
  let differences = 0,
    prefix = 0;
  const firstOffsets: number[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++)
    if (a[i] !== b[i]) {
      differences++;
      if (firstOffsets.length < 256) firstOffsets.push(i);
    }
  while (prefix < Math.min(a.length, b.length) && a[prefix] === b[prefix])
    prefix++;
  return {
    differences,
    firstOffsets,
    commonPrefixLength: prefix,
    offsetsTruncated: differences > 256,
    limitations:
      "Offset-aligned byte comparison; insertions shift subsequent offsets. A common prefix is not proof of a magic header or format.",
  };
}
export function analysisReport(
  sample: BinarySample,
  annotations: ByteAnnotation[],
  second?: BinarySample,
  sanitized = true,
) {
  return {
    schemaVersion: "binary-analysis-1.0",
    appVersion: "0.2.0",
    sanitized,
    source: {
      name: sanitized ? null : sample.name,
      length: sample.bytes.length,
      sha256: sanitized ? null : sample.sha256,
    },
    annotations: annotations.map((a) => ({
      ...a,
      label: sanitized ? "Hypothesis withheld for sharing." : a.label,
      status: "unvalidated hypothesis",
    })),
    comparison: second
      ? {
          source: {
            name: sanitized ? null : second.name,
            length: second.bytes.length,
            sha256: sanitized ? null : second.sha256,
          },
          ...binaryDiff(sample.bytes, second.bytes),
        }
      : null,
    limitations: [
      "User-imported raw bytes only. No parser, protocol identification, traffic capture or automatic execution.",
      "Raw bytes are excluded. Lengths and offsets may still identify samples.",
    ],
  };
}
