export type TeleportType = `0${string}`;

export type TileType =
  | "WL" // Wall (Static kinematic collider)
  | "DT" // Dot (Static collectible data node)
  | "PP" // Power Pill (Animated dynamic modifier)
  | "ES" // Empty Space (Unwalkable, non-interactive node)
  | "LE" // Lair Entrance (One-way directional ghost gate)
  | "LT" // Lair Tile (Internal ghost spawning enclosure)
  | "PM" // Player Spawn Point
  | "BY" | "PY" | "IY" | "CE" // Ghost Spawns (Blinky, Pinky, Inky, Clyde)
  | "SW" // Lair Switch Tile
  | TeleportType;

export const TILE_SIZE = 36;

export class GridMatrix {
  private matrix: TileType[][];
  public readonly width: number;
  public readonly height: number;

  constructor(initialLayout: TileType[][]) {
    this.matrix = initialLayout.map(row => [...row]); // Deep copy outer bounds
    this.height = this.matrix.length;
    this.width = this.matrix[0] ? this.matrix[0].length : 0;
  }

  /**
   * Evaluates bounds and returns the token at the target index.
   * Returns a Wall "WL" if queried completely outside grid boundaries.
   */
  public getTileAt(x: number, y: number): TileType {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return "WL"; 
    }
    return this.matrix[y][x];
  }

  /**
   * Safe operational mutation wrapper for consuming data nodes (e.g. Dot -> Empty Space).
   */
  public setTileAt(x: number, y: number, type: TileType): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.matrix[y][x] = type;
    }
  }

  public static isTeleportToken(token: TileType): token is TeleportType {
    return typeof token === "string" && token.startsWith("0") && token.length > 1;
  }
}