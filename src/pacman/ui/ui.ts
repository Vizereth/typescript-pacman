import { CANVAS_CONFIG } from "../config/canvas.js";
import { Entity } from "../entities/entity.js";
import { GameState } from "../game/state.js";

class UI extends Entity {
  private gameState: GameState;
  private fontSize: string;
  private fontStyle: string;
  private color: string;

  constructor() {
    super(CANVAS_CONFIG.canvasIds.ui, true);

    this.gameState = GameState.getInstance();
    this.fontSize = this.tileSize - this.tileSize / 10 + "px";
    this.fontStyle = "Audiowide";
    this.color = "rgb(250, 240, 98)";
  }

  update() {
    this.draw();
    this.drawScore();
    this.drawLives();
  }

  private draw() {
    const scoreCoords = { x: this.tileSize / 2, y: this.tileSize * 32 };
    const livesCoords = { x: this.tileSize * 20, y: this.tileSize * 32 };

    this.ctx.fillStyle = this.color;
    this.ctx.font = this.fontSize + " " + this.fontStyle;
    this.ctx.fillText("SCORE: ", scoreCoords.x, scoreCoords.y);

    this.ctx.fillStyle = this.color;
    this.ctx.font = this.fontSize + " " + this.fontStyle;
    this.ctx.fillText("LIVES: ", livesCoords.x, livesCoords.y);
  }

  private drawScore() {
    const coords = {
      x: this.tileSize / 2 + this.tileSize * 4,
      y: this.tileSize * 32,
    };

    this.ctx.fillStyle = this.color;
    this.ctx.font = this.fontSize + " " + this.fontStyle;
    this.ctx.fillText(this.gameState.score.toString(), coords.x, coords.y);
  }

  private drawLives() {
    const coords = {
      cx: this.tileSize * 24.5,
      cy: this.tileSize * 32 - this.tileSize / 2.5,
      r: this.tileSize / 2,
      a1: 0.2 * Math.PI,
      a2: 1.8 * Math.PI,
    };

    for (let i = 0; i < this.gameState.lives; i++) {
      this.ctx.fillStyle = this.color;
      this.ctx.beginPath();
      this.ctx.arc(
        coords.cx + this.tileSize * i,
        coords.cy,
        coords.r,
        coords.a1,
        coords.a2
      );
      this.ctx.lineTo(coords.cx + this.tileSize * i, coords.cy);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  // drawDefaultScore() {
  //   canvasCleaner("score");

  //   const coords = {
  //     FSx: blockWidth / 2,
  //     FSy: tileSize * 31,
  //     BSx: blockWidth * 17,
  //     BSy: tileSize * 31,
  //   };

  //   const colorFS = "rgb(101, 255, 101)";
  //   const colorBS = "rgb(77, 226, 252)";
  //   const fontSize = blockWidth - blockWidth / 12 + "px";
  //   const fontStyle = "Audiowide";

  //   ctx_score.fillStyle = colorFS;
  //   ctx_score.font = fontSize + " " + fontStyle;
  //   ctx_score.fillText("FINAL SCORE: " + game.score, coords.FSx, coords.FSy);

  //   ctx_score.fillStyle = colorBS;
  //   ctx_score.font = fontSize + " " + fontStyle;
  //   ctx_score.fillText("BEST SCORE: 0", coords.BSx, coords.BSy);
  // }
}

export { UI };
