import { CANVAS_CONFIG } from "../config/canvas.js";
import { Entity } from "../entities/entity.js";
import { GameState } from "../game/state.js";

class Pill extends Entity {
  private gameState: GameState;
  private pillColor: string;
  public positions: { i: number; j: number }[];
  private animationCounter: number;

  constructor() {
    super(CANVAS_CONFIG.canvasIds.pill, true);

    this.gameState = GameState.getInstance();
    this.pillColor = "#F0F4FF";
    this.positions = [];
    this.animationCounter = 0;
  }

  public override init() {
    const map = this.gameState.levelData.map;

    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === "PP") {
          this.positions.push({ i, j });
        }
      }
    }
  }

  public override reset() {
    this.positions = [];
    this.animationCounter = 0;
  }

  public update() {
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
    const pulseSize = Math.sin(this.animationCounter * 3) * (this.tileSize / 15);
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
