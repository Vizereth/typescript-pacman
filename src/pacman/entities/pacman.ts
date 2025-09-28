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
  private needsAligning: boolean;
  private isTurning: boolean;
  private speed: number;

  private isBuffed: boolean;
  private buffTime: number;

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
    this.needsAligning = false;
    this.isTurning = false;
    this.speed = Math.round((this.tileSize / 8) * 10) / 10;

    this.isBuffed = false;
    this.buffTime = this.gameState.levelData.buffTime;

    this.mouthOpen = 1;

    this.r = this.tileSize * 0.5;
    this.color = "rgb(255, 255, 0)";
  }

  public override init() {
    this.getSpawnCoords();
  }

  public override reset() {
    this.mouthOpen = 1;
    this.direction = { dx: 0, dy: 0 };
    this.nextDirection = null;
  }

  public update(dt: number) {
    if (!this.gameState.isRunning) return;

    this.draw();
    this.updateMovement(dt);
  }

  private getSpawnCoords() {
    const map = this.gameState.levelData.map;

    for (let y = 0; y < map.length; y++) {
      let x = map[y].findIndex((tile: string) => tile === "PACMAN");
      if (x !== -1) {
        this.x = x * this.tileSize + this.tileSize / 2;
        this.y = y * this.tileSize + this.tileSize / 2;
        return;
      }
    }
  }

  private updateMovement(dt: number) {
    if (this.willHitWall()) return;

    if (this.isTurning) this.tryTurn();

    const { newX, newY } = this.getNextPosition();

    this.x = newX;
    this.y = newY;

    if (this.needsAligning) this.alignToAxis();

    this.handleCollisionWithEatable(newX, newY);
  }

  private getNextPosition() {
    return {
      newX: this.x + this.direction.dx * this.speed,
      newY: this.y + this.direction.dy * this.speed,
    };
  }

  private snapToTileCenter() {
    const { centerX, centerY } = this.collision.getTileCenter(this.x, this.y);

    if (this.direction.dx !== 0) this.x = centerX;
    if (this.direction.dy !== 0) this.y = centerY;
  }

  private alignToAxis(): void {
    const { centerX, centerY } = this.collision.getTileCenter(this.x, this.y);

    const tolerance = Math.floor(2 * this.speed);

    if (this.direction.dx !== 0 && Math.abs(this.y - centerY) < tolerance)
      this.y = centerY;
    if (this.direction.dy !== 0 && Math.abs(this.x - centerX) < tolerance)
      this.x = centerX;

    this.needsAligning = false;
  }

  private isAtTileCenter(): boolean {
    const { centerX, centerY } = this.collision.getTileCenter(this.x, this.y);

    const tolerance = 3 * this.speed;

    if (
      (this.direction.dx !== 0 && Math.abs(this.x - centerX) <= tolerance) ||
      (this.direction.dy !== 0 && Math.abs(this.y - centerY) <= tolerance)
    ) {
      return true;
    }

    return false;
  }

  private isNextTileWall(): boolean {
    if (!this.nextDirection) return false;

    const { tileX, tileY } = this.collision.getTile(this.x, this.y);

    const nextTileX = tileX + this.nextDirection.dx;
    const nextTileY = tileY + this.nextDirection.dy;

    return this.collision.isWall(nextTileX, nextTileY);
  }

  private willChangeAxis(): boolean {
    if (!this.nextDirection) return false;

    return (
      (this.direction.dx !== 0 && this.nextDirection.dy !== 0) ||
      (this.direction.dy !== 0 && this.nextDirection.dx !== 0)
    );
  }

  public changeDirection(dir: { dx: number; dy: number }) {
    this.nextDirection = dir;

    if (!this.willChangeAxis() && !this.isNextTileWall()) {
      this.direction = this.nextDirection;
      return;
    }

    if (!this.tryTurn()) this.tryBufferTurn();
  }

  private tryTurn(): boolean {
    if (!this.nextDirection) return false;

    if (this.isAtTileCenter() && !this.isNextTileWall()) {
      this.snapToTileCenter();
      this.direction = this.nextDirection;
      this.nextDirection = null;
      this.isTurning = false;
      this.needsAligning = true;

      return true;
    }

    return false;
  }

  private tryBufferTurn() {
    if (!this.nextDirection) return false;

    const { tileX, tileY } = this.collision.getTile(this.x, this.y);

    const bufferTileX =
      tileX +
      (this.direction.dx !== 0 ? this.direction.dx : this.nextDirection.dx);
    const bufferTileY =
      tileY +
      (this.direction.dy !== 0 ? this.direction.dy : this.nextDirection.dy);

    if (!this.collision.isWall(bufferTileX, bufferTileY)) this.isTurning = true;
  }

  private willHitWall(): boolean {
    const boundX = this.x + this.direction.dx * (this.speed + this.r);
    const boundY = this.y + this.direction.dy * (this.speed + this.r);

    const { tileX, tileY } = this.collision.getTile(boundX, boundY);

    return this.collision.isWall(tileX, tileY);
  }

  private handleCollisionWithEatable(x: number, y: number) {
    const { tileX, tileY } = this.collision.getTile(this.x, this.y);
    this.tryEatFood(tileX, tileY);
    this.tryEatPill(tileX, tileY);
  }

  private tryEatFood(tileX: number, tileY: number) {
    const food = this.entityManager.getFood();
    if (food.positions.has(`${tileY},${tileX}`)) {
      food.eat(tileY, tileX);
    }
  }

  private tryEatPill(tileX: number, tileY: number) {
    const pill = this.entityManager.getPill();
    if (
      !this.isBuffed &&
      pill.positions.some((pos) => pos.i === tileY && pos.j === tileX)
    ) {
      pill.eat(tileY, tileX);
      this.isBuffed = true;
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
