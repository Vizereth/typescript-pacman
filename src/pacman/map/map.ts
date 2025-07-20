import { CANVAS_CONFIG } from "../config/canvas.js";
import { Entity } from "../entities/entity.js";
import { GameState } from "../game/state.js";

class Map extends Entity {
  private gameState: GameState;
  private lineWidth: number;
  private lineColor: string;

  constructor() {
    super(CANVAS_CONFIG.canvasIds.map, false);

    this.gameState = GameState.getInstance();
    this.lineWidth = Math.floor((CANVAS_CONFIG.tile.size * 20) / 100);
    this.lineColor = this.gameState.levelData.mapColor;
  }

  update() {
    const map = this.gameState.levelData.map;

    this.ctx.strokeStyle = this.lineColor;
    this.ctx.lineWidth = this.lineWidth;

    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        const tile = map[i][j];

        const drawActions: Record<string, (i: number, j: number) => void> = {
          WH: this.drawHorizontalLine,
          WV: this.drawVerticalLine,
          TL: this.drawTopLeftCurve,
          TR: this.drawTopRightCurve,
          BR: this.drawBottomRightCurve,
          BL: this.drawBottomLeftCurve,
        };

        const drawMethod = drawActions[tile];
        if (drawMethod) drawMethod.call(this, i, j);
      }
    }
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  private drawCurve(
    x1: number,
    y1: number,
    cx: number,
    cy: number,
    x2: number,
    y2: number
  ) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.quadraticCurveTo(cx, cy, x2, y2);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  private drawHorizontalLine(i: number, j: number) {
    const x = this.tileSize * j;
    const y = this.tileSize * i + this.tileSize / 2;
    this.drawLine(x, y, x + this.tileSize, y);
  }

  private drawVerticalLine(i: number, j: number) {
    const x = this.tileSize * j + this.tileSize / 2;
    const y = this.tileSize * i;
    this.drawLine(x, y, x, y + this.tileSize);
  }

  private drawTopRightCurve(i: number, j: number) {
    const x = this.tileSize * j + this.tileSize / 2;
    const y = this.tileSize * i + this.tileSize;
    this.drawCurve(
      x,
      y,
      x,
      y - this.tileSize / 2,
      x - this.tileSize / 2,
      y - this.tileSize / 2
    );
  }

  private drawTopLeftCurve(i: number, j: number) {
    const x = this.tileSize * j + this.tileSize / 2;
    const y = this.tileSize * i + this.tileSize;
    this.drawCurve(
      x,
      y,
      x,
      y - this.tileSize / 2,
      x + this.tileSize / 2,
      y - this.tileSize / 2
    );
  }

  private drawBottomLeftCurve(i: number, j: number) {
    const x = this.tileSize * j + this.tileSize / 2;
    const y = this.tileSize * i;
    this.drawCurve(
      x,
      y,
      x,
      y + this.tileSize / 2,
      x + this.tileSize / 2,
      y + this.tileSize / 2
    );
  }

  private drawBottomRightCurve(i: number, j: number) {
    const x = this.tileSize * j + this.tileSize / 2;
    const y = this.tileSize * i;
    this.drawCurve(
      x,
      y,
      x,
      y + this.tileSize / 2,
      x - this.tileSize / 2,
      y + this.tileSize / 2
    );
  }
}

export { Map };
