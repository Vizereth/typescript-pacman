import { CANVAS_CONFIG } from "../config/canvas.js";
import { Entity } from "../entities/entity.js";
import { GameState } from "../game/state.js";

class Food extends Entity {
  private gameState: GameState;
  private color: string;
  public positions: Set<string>;
  public tileSize: number;

  constructor() {
    super(CANVAS_CONFIG.canvasIds.food, false);
    this.tileSize = CANVAS_CONFIG.tile.size;
    this.gameState = GameState.getInstance();
    this.color = "rgb(230, 230, 230)";
    this.positions = new Set();
  }

  public init() {
    const map = this.gameState.levelData.map;
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === "FOOD") {
          this.positions.add(`${i},${j}`);
        }
      }
    }
  }

  public update() {
    this.positions.forEach((pos) => {
      const [i, j] = pos.split(",").map(Number);
      this.draw(i, j);
    });
  }

  public eat(i: number, j: number) {
    this.positions.delete(`${i},${j}`);
    this.clearCanvas(j * this.tileSize, i * this.tileSize, this.tileSize, this.tileSize);
  }

  private draw(i: number, j: number) {
    const tileSize = CANVAS_CONFIG.tile.size;
    
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(
      tileSize * j + tileSize / 2,
      tileSize * i + tileSize / 2,
      tileSize / 8,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    this.ctx.closePath();
  }
}

export { Food };
