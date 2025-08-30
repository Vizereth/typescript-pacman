import { CANVAS_CONFIG } from "../config/canvas.js";
import { GameState } from "./state.js";

class Collision {
  private static instance: Collision;
  private gameState: GameState;
  private tileSize: number;

  constructor() {
    this.gameState = GameState.getInstance();
    this.tileSize = CANVAS_CONFIG.tile.size;
  }

  static getInstance(): Collision {
    if (!Collision.instance) {
      Collision.instance = new Collision();
    }
    return Collision.instance;
  }

  public isWall(x: number, y: number, allowTileGL: boolean = false): boolean {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);

    if (!this.gameState.levelData.map[tileY]) return true;

    const tile = this.gameState.levelData.map[tileY][tileX];

    const wallTiles = new Set(["WH", "WV", "TL", "TR", "BL", "BR", "GL"]);

    if (tile === "GL" && allowTileGL) {
      return false;
    }

    if (wallTiles.has(tile)) {
      return true;
    }

    return false;
  }

  public hasCollidedWithEatable(
    x: number,
    y: number
  ): { type: "FOOD" | "PILL" | "NONE"; i: number; j: number } {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);
    const map = this.gameState.levelData.map;

    const tileRow = map[tileY];
    if (!tileRow) return { type: "NONE", i: 0, j: 0 };

    const tile = tileRow[tileX];
    const eatableMap: Record<string, "FOOD" | "PILL"> = {
      FD: "FOOD",
      PP: "PILL",
    };

    const type = eatableMap[tile] ?? "NONE";

    return { type, i: tileY, j: tileX };
  }
}

export { Collision };
