export interface LayoutKey {
  vk: number;
  label: string;
  width?: number;
}
const k = (vk: number, label: string, width = 1): LayoutKey => ({
  vk,
  label,
  width,
});
// US ANSI reference geometry; it is not a detected physical keyboard layout.
export const keyboardLayout: LayoutKey[][] = [
  [
    k(27, "Esc"),
    ...Array.from({ length: 12 }, (_, i) => k(112 + i, `F${i + 1}`)),
  ],
  [
    k(192, "`"),
    ...[49, 50, 51, 52, 53, 54, 55, 56, 57, 48].map((v) =>
      k(v, String.fromCharCode(v)),
    ),
    k(189, "−"),
    k(187, "="),
    k(8, "Backspace", 2),
  ],
  [
    k(9, "Tab", 1.5),
    ...[81, 87, 69, 82, 84, 89, 85, 73, 79, 80].map((v) =>
      k(v, String.fromCharCode(v)),
    ),
    k(219, "["),
    k(221, "]"),
    k(220, "\\", 1.5),
  ],
  [
    k(20, "Caps", 1.75),
    ...[65, 83, 68, 70, 71, 72, 74, 75, 76].map((v) =>
      k(v, String.fromCharCode(v)),
    ),
    k(186, ";"),
    k(222, "'"),
    k(13, "Enter", 2.25),
  ],
  [
    k(160, "Shift", 2.25),
    ...[90, 88, 67, 86, 66, 78, 77].map((v) => k(v, String.fromCharCode(v))),
    k(188, ","),
    k(190, "."),
    k(191, "/"),
    k(161, "Shift", 2.75),
  ],
  [
    k(162, "Ctrl", 1.25),
    k(91, "Win", 1.25),
    k(164, "Alt", 1.25),
    k(32, "Space", 6.25),
    k(165, "Alt", 1.25),
    k(92, "Win", 1.25),
    k(93, "Menu", 1.25),
    k(163, "Ctrl", 1.25),
  ],
];
export const navigationLayout = [
  [k(44, "PrtSc"), k(145, "Scroll"), k(19, "Pause")],
  [k(45, "Insert"), k(36, "Home"), k(33, "PgUp")],
  [k(46, "Delete"), k(35, "End"), k(34, "PgDn")],
  [],
  [k(38, "↑")],
  [k(37, "←"), k(40, "↓"), k(39, "→")],
];
export const numpadLayout = [
  [k(144, "Num"), k(111, "/"), k(106, "*"), k(109, "−")],
  [k(103, "7"), k(104, "8"), k(105, "9"), k(107, "+")],
  [k(100, "4"), k(101, "5"), k(102, "6")],
  [k(97, "1"), k(98, "2"), k(99, "3")],
  [k(96, "0", 2), k(110, ".")],
];
