import { CANVAS_CONFIG } from "../config/canvas.js";
import { EntityManager } from "../entities/entityManager.js";
import { GameState } from "./state.js";

class Collision {
  private entityManager: EntityManager;
  private static instance: Collision;
  private gameState: GameState;
  private tileSize: number;

  constructor() {
    this.gameState = GameState.getInstance();
    this.entityManager = EntityManager.getInstance();
    this.tileSize = CANVAS_CONFIG.tile.size;
  }

  static getInstance(): Collision {
    if (!Collision.instance) {
      Collision.instance = new Collision();
    }
    return Collision.instance;
  }

  public getTile(x: number, y: number) {
    return {
      tileX: Math.floor(x / this.tileSize),
      tileY: Math.floor(y / this.tileSize),
    };
  }

  public getTileCenter(x: number, y: number) {
    return {
      centerX:
        Math.floor(x / this.tileSize) * this.tileSize + this.tileSize / 2,
      centerY:
        Math.floor(y / this.tileSize) * this.tileSize + this.tileSize / 2,
    };
  }

  public isWall(x: number, y: number, allowTileGL: boolean = false): boolean {
    if (!this.gameState.levelData.map[y]) return true;

    const tile = this.gameState.levelData.map[y][x];

    const wallTiles = new Set(["WH", "WV", "TL", "TR", "BL", "BR", "GL"]);

    if (tile === "GL" && allowTileGL) {
      return false;
    }

    if (wallTiles.has(tile)) {
      return true;
    }

    return false;
  }

  public hasCollidedWithEatable(x: number, y: number) {
    const { tileX, tileY } = this.getTile(x, y);

    const food = this.entityManager.getFood();
    const pill = this.entityManager.getPill();

    if (food.positions.has(`${tileY},${tileX}`)) {
      food.eat(tileY, tileX);
    }

    if (pill.positions.some((pos) => pos.i === tileY && pos.j === tileX)) {
      pill.eat(tileY, tileX);
    }
  }
}

export { Collision };
