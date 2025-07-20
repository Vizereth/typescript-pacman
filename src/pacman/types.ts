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
  FD: "FD", // Food
  PP: "PP", // Power Pill
  TP: "TP", // Teleport
  ES: "ES", // Empty space
  GL: "GL", // Ghost Lair Entrance
  PM: "PM", // Pac-man
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
  pill: Pill;
  pacman: Pacman;
};

export type {
  TileType,
  LevelConfigType,
  StaticEntitiesType,
  DynamicEntitiesType,
};
