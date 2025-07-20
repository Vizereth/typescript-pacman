import { CANVAS_CONFIG } from "../config/canvas.js";
import { Collision } from "../game/collision.js";
import { GameState } from "../game/state.js";
import { Entity } from "./entity.js";
import { EntityManager } from "./entityManager.js";

class Pacman extends Entity {
  private gameState: GameState;
  private entityManager: EntityManager;
  private collision: Collision;

  public x: number;
  public y: number;
  public direction: { dx: number; dy: number };
  public nextDirection: { dx: number; dy: number } | null;
  private speed: number;

  private mouthStates = [0, 1]; 
  private currentMouthFrameIndex = 0;
  private mouthFrameCounter = 0;
  private mouthFrameSkip = 12;

  private mouthOpen: number; 
  private mouthAngleMax = 0.25; 

  private r: number;
  private color: string;

  constructor() {
    super(CANVAS_CONFIG.canvasIds.pacman, true);

    this.gameState = GameState.getInstance();
    this.entityManager = EntityManager.getInstance();
    this.collision = Collision.getInstance();

    this.x = 0;
    this.y = 0;
    this.direction = { dx: 0, dy: 0 };
    this.nextDirection = null;
    this.speed = this.tileSize / 6;

    this.mouthOpen = 1;

    this.r = this.tileSize * 0.5;
    this.color = "rgb(255, 255, 0)";
  }

  public init() {
    this.getSpawnCoords();
  }

  public reset() {
    this.mouthOpen = 1;
    this.direction = { dx: 0, dy: 0 };
    this.nextDirection = null;
  }

  private getSpawnCoords() {
    const map = this.gameState.levelData.map;

    for (let y = 0; y < map.length; y++) {
      let x = map[y].findIndex((tile: string) => tile === "PM");
      if (x !== -1) {
        this.x = x * this.tileSize + this.tileSize / 2;
        this.y = y * this.tileSize + this.tileSize / 2;
        return;
      }
    }
  }

  public update() {
    if (!this.gameState.isRunning) return;

    this.draw();
    this.updateMovement();
  }

  private alignToGrid() {
    if (this.direction.dx !== 0 && this.direction.dy === 0) {
      this.y =
        Math.floor(this.y / this.tileSize) * this.tileSize + this.tileSize / 2;
    }

    if (this.direction.dy !== 0 && this.direction.dx === 0) {
      this.x =
        Math.floor(this.x / this.tileSize) * this.tileSize + this.tileSize / 2;
    }
  }

  public changeDirection(dx: number, dy: number) {
    const newX = this.x + dx * this.speed;
    const newY = this.y + dy * this.speed;

    const tileX = this.x + dx * (this.speed + this.r);
    const tileY = this.y + dy * (this.speed + this.r);

    const hitWall = this.collision.isWall(tileX, tileY);

    if (hitWall) return;

    this.x = newX;
    this.y = newY;
    this.direction = { dx, dy };

    this.alignToGrid();
  }

  private updateMovement() {
    const { newX, newY } = this.getNextPosition();

    this.handleEatableCollision(newX, newY);

    if (this.willHitWall()) return;

    this.x = newX;
    this.y = newY;
  }

  private getNextPosition() {
    return {
      newX: this.x + this.direction.dx * this.speed,
      newY: this.y + this.direction.dy * this.speed,
    };
  }

  private willHitWall(): boolean {
    const lookaheadX = this.x + this.direction.dx * (this.speed + this.r);
    const lookaheadY = this.y + this.direction.dy * (this.speed + this.r);
    return this.collision.isWall(lookaheadX, lookaheadY);
  }

  private handleEatableCollision(x: number, y: number): void {
    const { type, i, j } = this.collision.hasCollidedWithEatable(x, y);

    switch (type) {
      case "FOOD":
        this.entityManager.getStaticEntity("food").eat(i, j);
        break;
      case "PILL":
        this.entityManager.getDynamicEntity("pill").eat(i, j);
        break;
      default:
        break;
    }
  }

  private animateMouth() {
    this.mouthFrameCounter++;
    if (this.mouthFrameCounter % this.mouthFrameSkip !== 0) return;

    this.currentMouthFrameIndex = 1 - this.currentMouthFrameIndex;
    this.mouthOpen = this.mouthStates[this.currentMouthFrameIndex];
  }

  private draw() {
    let open = this.mouthOpen;
    let cx = this.x;
    let cy = this.y;
    let r = this.r;

    let a1 = open * this.mouthAngleMax * Math.PI;
    let a2 = (2 - open * this.mouthAngleMax) * Math.PI;

    let rotation = this.getRotation();

    this.ctx.fillStyle = this.color;
    this.ctx.save();
    this.ctx.translate(cx, cy);
    this.ctx.rotate(rotation);
    this.ctx.translate(-cx, -cy);
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, a1, a2);
    this.ctx.lineTo(cx, cy);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();

    this.animateMouth();
  }

  private getRotation(): number {
    if (this.direction.dx === -1) return Math.PI;
    if (this.direction.dx === 1) return 0;
    if (this.direction.dy === -1) return -Math.PI / 2;
    if (this.direction.dy === 1) return Math.PI / 2;
    return Math.PI;
  }

  // private drawEye(rotation: number) {
  //   let eyeAngle = Math.PI * 0.3;
  //   let eyeX = this.r * 0.6 * Math.cos(eyeAngle);
  //   let eyeY = this.r * 0.6 * Math.sin(eyeAngle);

  //   this.ctx.save();
  //   this.ctx.translate(this.x, this.y);
  //   this.ctx.rotate(rotation);
  //   this.ctx.translate(-this.x, -this.y);
  //   this.ctx.beginPath();
  //   this.ctx.arc(this.x + eyeX, this.y - eyeY, this.r * 0.15, 0, 2 * Math.PI);
  //   this.ctx.fillStyle = "#000";
  //   this.ctx.fill();
  //   this.ctx.restore();
  // }
}

export { Pacman };
