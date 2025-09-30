export const TILE = {
  WH: "WH", // Wall Horizontal
  WV: "WV", // Wall Vertical
  TL: "TL", // Top Left Corner
  TR: "TR", // Top Right Corner
  BL: "BL", // Bottom Left Corner
  BR: "BR", // Bottom Right Corner
  FD: "FOOD", // Food
  PP: "PILL", // Power Pill
  TP: "TELEPORT", // Teleport
  ES: "ES", // Empty space
  EX: "EX", // Ghost lair exit
  GL: "GL", // Ghost Lair Entrance
  PM: "PACMAN", // Pac-Man
  BY: "BLINKY",
  PY: "PINKY",
  IY: "INKY",
  CE: "CLYDE",
} as const;

type TileType = (typeof TILE)[keyof typeof TILE];

type LevelConfigType = {
  map: TileType[][];
  mapColor: string;
  buffDuration: number;
};

export type {
  TileType,
  LevelConfigType,
};
