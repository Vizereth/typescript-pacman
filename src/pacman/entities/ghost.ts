import { CANVAS_CONFIG } from "../config/canvas.js";
import { Collision } from "../game/collision.js";
import { GameState } from "../game/state.js";
import { Entity } from "./entity.js";

class Ghost extends Entity {
  // -------------------------
  // 1. Properties
  // -------------------------
  private gameState: GameState;
  private collision: Collision;
  private direction: { dx: number; dy: number };

  public name: string;
  public defaultColor: string;
  public color: string;
  public x: number;
  public y: number;
  public r: number;
  private defaultSpeed: number;
  private speed: number;
  private isScared: boolean;
  private isFleeing: boolean;

  // -------------------------
  // 2. Constructor
  // -------------------------
  constructor(name: string, color: string) {
    super(CANVAS_CONFIG.canvasIds.ghosts, true);

    this.gameState = GameState.getInstance();
    this.collision = Collision.getInstance();
    this.name = name;
    this.defaultColor = color;
    this.color = color;
    this.direction = { dx: 0, dy: 0 };
    this.x = 0;
    this.y = 0;
    this.r = this.tileSize / 2;
    this.defaultSpeed = this.tileSize / 16;
    this.speed = this.defaultSpeed;
    this.isScared = false;
    this.isFleeing = false;
  }

  // -------------------------
  // 3. Lifecycle
  // -------------------------
  public override init() {
    this.getRandomDirection();
  }

  public override reset() {
    this.direction = { dx: 0, dy: 0 };
    this.speed = this.defaultSpeed;
    this.color = this.defaultColor;
    this.isScared = false;
    this.isFleeing = false;
  }

  // -------------------------
  // 4. Update loop
  // -------------------------
  public update() {
    if (!this.gameState.isRunning) return;

    if (this.isAtTileCenter() && this.willHitWall()) {
      this.snapToCenter();
      this.getRandomDirection();
    }

    if (
      (this.direction.dx !== 0 || this.direction.dy !== 0) &&
      !this.willHitWall()
    ) {
      const { newX, newY } = this.getNextPosition();
      this.x = newX;
      this.y = newY;
    }

    this.draw();
  }

  private isAtTileCenter(): boolean {
    const { centerX, centerY } = this.collision.getTileCenter(this.x, this.y);
    const tolerance = this.speed * 2;
    return (
      Math.abs(this.x - centerX) <= tolerance &&
      Math.abs(this.y - centerY) <= tolerance
    );
  }

  private getNextPosition() {
    return {
      newX: this.x + this.direction.dx * this.speed,
      newY: this.y + this.direction.dy * this.speed,
    };
  }

  private snapToCenter() {
    const { centerX, centerY } = this.collision.getTileCenter(this.x, this.y);

    if (this.direction.dx != 0) this.x = centerX;
    if (this.direction.dy != 0) this.y = centerY;
  }

  private willHitWall(): boolean {
    const boundX =
      this.x + this.direction.dx * (this.speed + this.tileSize / 2);
    const boundY =
      this.y + this.direction.dy * (this.speed + this.tileSize / 2);

    const { tileX, tileY } = this.collision.getTile(boundX, boundY);

    return this.collision.isWall(tileX, tileY);
  }

  public getRandomDirection() {
    const directions = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];

    // Separate directions by axis
    const horizontalDirs = directions.filter((dir) => dir.dy === 0);
    const verticalDirs = directions.filter((dir) => dir.dx === 0);

    // Get current axis
    const isCurrentlyHorizontal = this.direction.dy === 0;
    const isCurrentlyVertical = this.direction.dx === 0;

    // Prefer perpendicular directions (70% chance)
    let preferredDirs;
    if (Math.random() < 0.7) {
      preferredDirs = isCurrentlyHorizontal ? verticalDirs : horizontalDirs;
    } else {
      preferredDirs = isCurrentlyHorizontal ? horizontalDirs : verticalDirs;
    }

    // Shuffle preferred directions
    for (let i = preferredDirs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [preferredDirs[i], preferredDirs[j]] = [
        preferredDirs[j],
        preferredDirs[i],
      ];
    }

    // Try preferred directions first
    for (const dir of preferredDirs) {
      const tileX = Math.floor(
        (this.x + dir.dx * (this.tileSize / 2 + this.speed)) / this.tileSize
      );
      const tileY = Math.floor(
        (this.y + dir.dy * (this.tileSize / 2 + this.speed)) / this.tileSize
      );
      if (!this.collision.isWall(tileX, tileY)) {
        this.direction = dir;
        return;
      }
    }

    // If no preferred direction works, try all directions
    for (const dir of directions) {
      const tileX = Math.floor(
        (this.x + dir.dx * (this.tileSize / 2 + this.speed)) / this.tileSize
      );
      const tileY = Math.floor(
        (this.y + dir.dy * (this.tileSize / 2 + this.speed)) / this.tileSize
      );
      if (!this.collision.isWall(tileX, tileY)) {
        this.direction = dir;
        return;
      }
    }

    this.direction = { dx: 0, dy: 0 };
  }

  // -------------------------
  // 5. Spawning
  // -------------------------
  public spawn() {
    const map = this.gameState.levelData.map;
    for (let y = 0; y < map.length; y++) {
      let x = map[y].findIndex((tile) => tile === this.name);
      if (x !== -1) {
        this.x = x * this.tileSize + this.tileSize / 2;
        this.y = y * this.tileSize + this.tileSize / 2;
        return;
      }
    }
  }

  // -------------------------
  // 6. Rendering
  // -------------------------
  private getDirectionLabel(): "LEFT" | "RIGHT" | "UP" | "DOWN" {
    const { dx, dy } = this.direction;
    if (dx === 1) return "RIGHT";
    if (dx === -1) return "LEFT";
    if (dy === -1) return "UP";
    if (dy === 1) return "DOWN";
    return "RIGHT";
  }

  private draw(): void {
    const ctx = this.ctx;
    const s = this.tileSize;
    const left = this.x - s / 2;
    const top = this.y - s / 2;

    const dir = this.getDirectionLabel();

    // Self-contained animation timing
    const now = Date.now();
    const animationPhase = ((now % 1000) / 1000) * Math.PI * 2; // Slightly faster (800ms cycle)
    const waveAmplitude = 2.5; // Even more pronounced - 6px amplitude!

    ctx.fillStyle = this.color;
    ctx.beginPath();

    // Main ghost body - rounded top (semi-circle)
    const centerX = left + s / 2;
    const centerY = top + s / 2;

    ctx.arc(centerX, centerY, s / 2, Math.PI, 0, false);

    // Very pronounced sine wave bottom
    const bottomBaseY = top + s;
    const waveCount = 6; // More segments for smoother wave
    const segmentWidth = s / waveCount;

    // Start from right side
    ctx.lineTo(left + s, bottomBaseY);

    // Create smooth sine wave across bottom
    for (let i = waveCount; i >= 0; i--) {
      const x = left + i * segmentWidth;
      // Continuous sine wave with high amplitude
      const phase = (i / waveCount) * Math.PI * 4 + animationPhase * 4; // Double frequency
      const wave = Math.sin(phase) * waveAmplitude;
      ctx.lineTo(x, bottomBaseY + wave);
    }

    ctx.closePath();
    ctx.fill();

    // Eyes with good spacing (20% from edges, 20% gap in middle)
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();

    // Left eye at 30% from left edge
    ctx.arc(left + s * 0.3, top + s / 2, s / 6, 0, Math.PI * 2);
    // Right eye at 70% from left edge (40% gap between eyes)
    ctx.arc(left + s * 0.7, top + s / 2, s / 6, 0, Math.PI * 2);

    ctx.fill();

    // Pupils - directional (same logic as before)
    ctx.fillStyle = "#0000AA";
    ctx.beginPath();

    const pupilOffset = s / 10;
    let leftPupilX = left + s * 0.3;
    let leftPupilY = top + s / 2;
    let rightPupilX = left + s * 0.7;
    let rightPupilY = top + s / 2;

    switch (dir) {
      case "LEFT":
        leftPupilX -= pupilOffset;
        rightPupilX -= pupilOffset;
        break;
      case "RIGHT":
        leftPupilX += pupilOffset;
        rightPupilX += pupilOffset;
        break;
      case "UP":
        leftPupilY -= pupilOffset;
        rightPupilY -= pupilOffset;
        break;
      case "DOWN":
        leftPupilY += pupilOffset;
        rightPupilY += pupilOffset;
        break;
    }

    ctx.arc(leftPupilX, leftPupilY, s / 12, 0, Math.PI * 2);
    ctx.arc(rightPupilX, rightPupilY, s / 12, 0, Math.PI * 2);
    ctx.fill();
  }
}

export { Ghost };
