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
  private buffDuration: number;
  private buffRemaining: number;

  private mouthOpen: boolean = false;
  private mouthFrameCounter: number = 0;
  private readonly mouthFrameSkip: number = 9; // 1/6 frame rate
  private readonly mouthAngle: number = Math.PI / 4; // 45 degrees for classic wedge

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
    this.buffDuration = this.gameState.levelData.buffDuration;
    this.buffRemaining = 0;

    this.r = this.tileSize * 0.5;
    this.color = "rgb(255, 255, 0)";
  }

  public override init() {
    this.getSpawnCoords();
  }

  public override reset() {
    this.mouthOpen = false;
    this.direction = { dx: 0, dy: 0 };
    this.nextDirection = null;
  }

  public update(dt: number) {
    if (!this.gameState.isRunning) return;

    this.draw();
    this.updateMovement(dt);

    if (this.isBuffed) this.updateBuff(dt);
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
      this.gameState.updateScore("DOT");
    }
  }

  private tryEatPill(tileX: number, tileY: number) {
    const pill = this.entityManager.getPill();
    if (
      !this.isBuffed &&
      pill.positions.some((pos) => pos.i === tileY && pos.j === tileX)
    ) {
      pill.eat(tileY, tileX);
      this.gameState.updateScore("POWER_PELLET");
      this.isBuffed = true;
      this.buffRemaining = this.buffDuration;
    }
  }

  public updateBuff(dt: number) {
    if (this.buffRemaining > 0) {
      this.buffRemaining -= dt;
      if (this.buffRemaining <= 0) {
        this.isBuffed = false;
        this.buffRemaining = 0;
      }
    }
  }

  private draw(): void {
    const cx = this.x;
    const cy = this.y;
    const r = this.r;
    const rotation = this.getRotation();

    this.ctx.fillStyle = this.color;
    this.ctx.save();
    this.ctx.translate(cx, cy);
    this.ctx.rotate(rotation);

    if (this.mouthOpen) {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, r, this.mouthAngle, 2 * Math.PI - this.mouthAngle);
      this.ctx.lineTo(0, 0);
      this.ctx.closePath();
      this.ctx.fill();
    } else {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, r, 0, 2 * Math.PI);
      this.ctx.fill();
    }

    this.ctx.restore();

    this.animateMouth();
  }

  private animateMouth(): void {
    this.mouthFrameCounter++;
    if (this.mouthFrameCounter < this.mouthFrameSkip) return;

    this.mouthFrameCounter = 0;
    this.mouthOpen = !this.mouthOpen;
  }

  private getRotation(): number {
    if (this.direction.dx === -1) return Math.PI;
    if (this.direction.dx === 1) return 0;
    if (this.direction.dy === -1) return -Math.PI / 2;
    if (this.direction.dy === 1) return Math.PI / 2;
    return 0;
  }
}

export { Pacman };
