import type { Ghost } from "./entities/ghost.js";
import type { Pacman } from "./entities/pacman.js";
import type { Food } from "./map/food.js";
import type { Map } from "./map/map.js";
import type { Pill } from "./map/pill.js";
import type { UI } from "./ui/ui.js";

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
  GL: "GL", // Ghost Lair Entrance
  PM: "PACMAN", // Pac-man
  BY: "BLINKY",
  PY: "PINKY",
  IY: "INKY",
  CE: "CLYDE",
} as const;

type TileType = (typeof TILE)[keyof typeof TILE];

type LevelConfigType = {
  map: TileType[][];
  mapColor: string;
  pillCount: number;
};

type StaticEntitiesType = {
  food: Food;
  ui: UI;
  map: Map;
};

type DynamicEntitiesType = {
  pacman: Pacman;
  ghosts: Ghost[];
  pill: Pill;
};

export type {
  TileType,
  LevelConfigType,
  StaticEntitiesType,
  DynamicEntitiesType,
};
