import { expect, it } from "vitest";
import { keyboardLayout, navigationLayout } from "./keyboardLayout";
it("keeps ANSI body rows aligned and navigation keys in their proper relative rows", () => {
  expect(keyboardLayout).toHaveLength(6);
  expect(keyboardLayout[0].map((k) => k.vk)).toEqual([
    27,
    ...Array.from({ length: 12 }, (_, i) => 112 + i),
  ]);
  for (const row of keyboardLayout.slice(1))
    expect(row.reduce((sum, k) => sum + (k.width ?? 1), 0)).toBe(15);
  expect(navigationLayout.map((row) => row.map((k) => k.vk))).toEqual([
    [44, 145, 19],
    [45, 36, 33],
    [46, 35, 34],
    [],
    [38],
    [37, 40, 39],
  ]);
});

it("uses conventional quarter-unit stagger with Q above A rather than S", () => {
  const start = (row: number, vk: number) => {
    let position = 0;
    for (const k of keyboardLayout[row]) {
      if (k.vk === vk) return position;
      position += k.width ?? 1;
    }
    throw new Error("Missing reference key");
  };
  expect(start(2, 81)).toBe(1.5);
  expect(start(3, 65)).toBe(1.75);
  expect(start(3, 83)).toBe(2.75);
  for (const row of keyboardLayout.slice(1))
    expect(row.reduce((n, k) => n + (k.width ?? 1) * 4, 0)).toBe(60);
});
