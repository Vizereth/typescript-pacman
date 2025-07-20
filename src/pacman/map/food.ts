import { CANVAS_CONFIG } from "../config/canvas.js";
import { Entity } from "../entities/entity.js";
import { GameState } from "../game/state.js";

class Food extends Entity {
  private gameState: GameState;
  private color: string;

  constructor() {
    super(CANVAS_CONFIG.canvasIds.food, false);
    this.gameState = GameState.getInstance();
    this.color = "rgb(230, 230, 230)";
  }

  init() {
    const map = this.gameState.levelData.map;
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === "FD") {
          this.gameState.foodMap.add(`${i},${j}`);
        }
      }
    }
  }

  public update() {
    this.gameState.foodMap.forEach((pos) => {
      const [i, j] = pos.split(",").map(Number);
      this.draw(i, j);
    });
  }

  public eat(i: number, j: number) {
    this.gameState.foodMap.delete(`${i},${j}`);
    this.clearCanvas();
    this.update();
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
