import { CANVAS_CONFIG } from "../config/canvas.js";
import { Entity } from "../entities/entity.js";
import { GameState } from "../game/state.js";

class Pill extends Entity {
  private gameState: GameState;
  private pillColor: string;
  private positions: { i: number; j: number }[];
  private animationCounter: number;

  constructor() {
    super(CANVAS_CONFIG.canvasIds.pill, true);

    this.gameState = GameState.getInstance();
    this.pillColor = "rgb(250, 250, 0)";
    this.positions = [];
    this.animationCounter = 0;
  }

  init() {
    const map = this.gameState.levelData.map;

    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === "PILL") {
          this.positions.push({ i, j });
        }
      }
    }
  }

  update() {
    const animationSpeed = 0.05;
    this.animationCounter += animationSpeed;

    this.positions.forEach(({ i, j }) => {
      this.draw(i, j);
    });
  }

  public eat(i: number, j: number) {
    this.positions = this.positions.filter((p) => !(p.i === i && p.j === j));
    this.clearCanvas();
  }

  private draw(i: number, j: number) {
    const baseSize = this.tileSize / 6;
    const pulseSize = Math.sin(this.animationCounter) * (this.tileSize / 20);
    const finalSize = baseSize + pulseSize;

    this.ctx.fillStyle = this.pillColor;
    this.ctx.beginPath();
    this.ctx.arc(
      this.tileSize * j + this.tileSize / 2,
      this.tileSize * i + this.tileSize / 2,
      finalSize,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    this.ctx.closePath();
  }
}

export { Pill };
