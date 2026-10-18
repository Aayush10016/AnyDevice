/** Bounded offline HID descriptor inspection. No device traffic or report writes. */
export interface DescriptorItem {
  offset: number;
  type: number;
  tag: number;
  data: number[];
  value: number;
}
export function inspectDescriptor(bytes: Uint8Array) {
  if (!bytes.length || bytes.length > 4096)
    throw new Error("Descriptor must contain 1–4096 bytes.");
  const items: DescriptorItem[] = [];
  const reports = new Map<string, { type: string; id: number; bits: number }>();
  let globals = { page: 0, size: 0, count: 0, id: 0 },
    depth = 0;
  const stack: (typeof globals)[] = [];
  for (let at = 0; at < bytes.length;) {
    if (items.length >= 1024) throw new Error("Descriptor exceeds 1024 items.");
    const offset = at,
      prefix = bytes[at++];
    if (prefix === 0xfe) {
      if (at + 2 > bytes.length) throw new Error("Truncated long-item header.");
      const length = bytes[at++],
        tag = bytes[at++];
      if (at + length > bytes.length) throw new Error("Truncated long item.");
      items.push({
        offset,
        type: 3,
        tag,
        data: Array.from(bytes.slice(at, at + length)),
        value: 0,
      });
      at += length;
      continue;
    }
    const length = [0, 1, 2, 4][prefix & 3],
      type = (prefix >> 2) & 3,
      tag = prefix >> 4;
    if (at + length > bytes.length) throw new Error("Truncated short item.");
    const data = Array.from(bytes.slice(at, at + length));
    at += length;
    const value = data.reduce((sum, b, i) => sum + b * 2 ** (8 * i), 0);
    items.push({ offset, type, tag, data, value });
    if (type === 1) {
      if (tag === 0) globals.page = value;
      if (tag === 7) {
        if (value > 65535) throw new Error("Excessive report size.");
        globals.size = value;
      }
      if (tag === 8) {
        if (!value || value > 255) throw new Error("Invalid report ID.");
        globals.id = value;
      }
      if (tag === 9) {
        if (value > 65535) throw new Error("Excessive report count.");
        globals.count = value;
      }
      if (tag === 10) {
        if (stack.length >= 16) throw new Error("Global stack too deep.");
        stack.push({ ...globals });
      }
      if (tag === 11) {
        const saved = stack.pop();
        if (!saved) throw new Error("Global stack underflow.");
        globals = saved;
      }
    }
    if (type === 0) {
      if (tag === 10 && ++depth > 32)
        throw new Error("Collection nesting too deep.");
      if (tag === 12 && --depth < 0) throw new Error("Collection underflow.");
      if ([8, 9, 11].includes(tag)) {
        if (!depth || !globals.size || !globals.count)
          throw new Error("Report item lacks a collection or size/count.");
        const kind = tag === 8 ? "input" : tag === 9 ? "output" : "feature",
          key = `${kind}:${globals.id}`;
        const row = reports.get(key) ?? { type: kind, id: globals.id, bits: 0 };
        row.bits += globals.size * globals.count;
        if (row.bits > 65535 * 8)
          throw new Error("Report exceeds 65535 payload bytes.");
        reports.set(key, row);
      }
    }
  }
  if (depth || stack.length)
    throw new Error("Unclosed collection or global stack.");
  if (!reports.size)
    throw new Error("No bounded input/output/feature report structure found.");
  const rows = [...reports.values()];
  if (rows.some((r) => r.id === 0) && rows.some((r) => r.id !== 0))
    throw new Error("Mixed numbered and unnumbered reports.");
  return {
    profileVersion: "offline-hid-descriptor-1.0",
    source: "User-imported bytes; device identity unverified",
    verifiedModel: false,
    operations: [],
    items,
    reports: rows.map((r) => ({
      ...r,
      wireBytes: Math.ceil(r.bits / 8) + (r.id ? 1 : 0),
      windowsBufferBytes: Math.ceil(r.bits / 8) + 1,
    })),
    limitations: [
      "Unknown items/usages preserved numerically; no vendor semantics inferred.",
      "Declared output reports do not authorize writes or establish LED function.",
      "Imported bytes are not proof that any connected device exposes this descriptor.",
    ],
  };
}
