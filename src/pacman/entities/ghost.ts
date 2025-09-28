import { CANVAS_CONFIG } from "../config/canvas.js";
import { Collision } from "../game/collision.js";
import { GameState } from "../game/state.js";
import { Entity } from "./entity.js";

class Ghost extends Entity {
  private gameState: GameState;
  private collision: Collision;
  private direction: { dx: number; dy: number };

  public name: string;
  public defaultColor: string;
  public color: string;
  public x: number;
  public y: number;
  private defaultSpeed: number;
  private speed: number;
  private exited: boolean;
  private pathToExit: { dx: number; dy: number }[] = [];
  private isScared: boolean;
  private isFleeing: boolean;

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
    this.defaultSpeed = this.tileSize / 16;
    this.speed = this.tileSize / 16;
    this.exited = false;
    this.isScared = false;
    this.isFleeing = false;
  }

  public override init() {
    this.getSpawnCoords();
    this.getRandomDirection();
  }

  public override reset() {
    this.direction = { dx: 0, dy: 0 };
    this.speed = this.defaultSpeed;
    this.color = this.defaultColor;
    this.exited = false;
    this.isScared = false;
    this.isFleeing = false;
  }

  public update() {
    if (!this.gameState.isRunning) return;

    if (!this.exited) {
      this.goToLairExit();
    }

    this.draw();
    this.updateMovement();
  }

  private goToLairExit() {
    if (this.pathToExit.length === 0) {
      this.pathToExit = this.findPathToExit();
    }

    if (this.pathToExit.length > 0) {
      const move = this.pathToExit[0];
      const tileCenterX =
        Math.floor(this.x / this.tileSize) * this.tileSize + this.tileSize / 2;
      const tileCenterY =
        Math.floor(this.y / this.tileSize) * this.tileSize + this.tileSize / 2;

      const closeToCenter =
        Math.abs(this.x - tileCenterX) < 1 &&
        Math.abs(this.y - tileCenterY) < 1;
      if (closeToCenter) {
        this.alignToGrid();
        this.pathToExit.shift();
        if (move) {
          this.changeDirection(move.dx, move.dy);
        }
      }

      const { newX, newY } = this.getNextPosition();
      this.x = newX;
      this.y = newY;

      const currentTile =
        this.gameState.levelData.map[Math.floor(this.y / this.tileSize)][
          Math.floor(this.x / this.tileSize)
        ];
      if (currentTile === "ES") {
        this.exited = true;
        this.direction = { dx: 0, dy: 0 };
      }

      this.draw();
      return;
    }
  }

  private findLairExitTile(): { x: number; y: number } | null {
    const map = this.gameState.levelData.map;

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] !== "GL") continue;

        const neighbors = [
          [x + 1, y],
          [x - 1, y],
          [x, y + 1],
          [x, y - 1],
        ];

        for (const [nx, ny] of neighbors) {
          if (!map[ny] || !map[ny][nx]) continue;
          if (map[ny][nx] === "ES") {
            return { x: nx, y: ny };
          }
        }
      }
    }

    return null;
  }

  private findPathToExit(): { dx: number; dy: number }[] {
    const map = this.gameState.levelData.map;
    const tileSize = this.tileSize;

    const startX = Math.floor(this.x / tileSize);
    const startY = Math.floor(this.y / tileSize);
    const start = { x: startX, y: startY };

    const exit = this.findLairExitTile();
    if (!exit) return [];

    const visited = new Set<string>();
    const queue: Array<{
      x: number;
      y: number;
      path: { dx: number; dy: number }[];
    }> = [{ x: start.x, y: start.y, path: [] }];

    const directions = [
      { dx: 0, dy: -1 }, // up
      { dx: 0, dy: 1 }, // down
      { dx: -1, dy: 0 }, // left
      { dx: 1, dy: 0 }, // right
    ];

    while (queue.length > 0) {
      const { x, y, path } = queue.shift()!;
      const key = `${x},${y}`;
      if (visited.has(key)) continue;
      visited.add(key);

      if (x === exit.x && y === exit.y) {
        return path;
      }

      for (const dir of directions) {
        const nx = x + dir.dx;
        const ny = y + dir.dy;

        if (!map[ny] || !map[ny][nx]) continue;

        const px = nx * tileSize + tileSize / 2;
        const py = ny * tileSize + tileSize / 2;

        const canWalk = !this.collision.isWall(px, py, true); // allow GL during exit phase
        if (!canWalk) continue;

        queue.push({
          x: nx,
          y: ny,
          path: [...path, dir],
        });
      }
    }

    return [];
  }

  private getSpawnCoords() {
    const map = this.gameState.levelData.map;

    for (let y = 0; y < map.length; y++) {
      let x = map[y].findIndex((tile: string) => tile === this.name);
      if (x !== -1) {
        this.x = x * this.tileSize + this.tileSize / 2;
        this.y = y * this.tileSize + this.tileSize / 2;
        return;
      }
    }
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

    const tileX = this.x + dx * (this.speed + this.tileSize / 2);
    const tileY = this.y + dy * (this.speed + this.tileSize / 2);

    const hitWall = this.collision.isWall(tileX, tileY);

    if (hitWall) return;

    this.x = newX;
    this.y = newY;
    this.direction = { dx, dy };

    this.alignToGrid();
  }

  public getRandomDirection(): void {
    const directions = [
      { dx: 1, dy: 0 }, // RIGHT
      { dx: -1, dy: 0 }, // LEFT
      { dx: 0, dy: -1 }, // UP
      { dx: 0, dy: 1 }, // DOWN
    ];

    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [directions[i], directions[j]] = [directions[j], directions[i]];
    }

    for (const dir of directions) {
      const tileX = this.x + dir.dx * (this.tileSize / 2 + this.speed);
      const tileY = this.y + dir.dy * (this.tileSize / 2 + this.speed);

      if (!this.collision.isWall(tileX, tileY)) {
        this.direction = dir;
        return;
      }
    }

    this.direction = { dx: 0, dy: 0 };
  }

  private getDirectionLabel(): "LEFT" | "RIGHT" | "UP" | "DOWN" {
    const { dx, dy } = this.direction;
    if (dx === 1) return "RIGHT";
    if (dx === -1) return "LEFT";
    if (dy === -1) return "UP";
    if (dy === 1) return "DOWN";
    return "RIGHT";
  }

  private updateMovement() {
    const { newX, newY } = this.getNextPosition();

    if (this.willHitWall()) {
      this.getRandomDirection();
      return;
    }

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
    const lookaheadX =
      this.x + this.direction.dx * (this.speed + this.tileSize / 2);
    const lookaheadY =
      this.y + this.direction.dy * (this.speed + this.tileSize / 2);
    return this.collision.isWall(lookaheadX, lookaheadY, !this.exited);
  }

  private draw(): void {
    const ctx = this.ctx;
    const s = this.tileSize;
    const left = this.x - s / 2;
    const top = this.y - s / 2;

    const dir = this.getDirectionLabel();

    const tl = left + s;
    const base = top + s - 3;
    const inc = s / 10;

    const high = 3;
    const low = -3;

    ctx.fillStyle = this.color;
    ctx.beginPath();

    // Body top
    ctx.moveTo(left, base);
    ctx.quadraticCurveTo(left, top, left + s / 2, top);
    ctx.quadraticCurveTo(left + s, top, left + s, base);

    // Wavy bottom
    ctx.quadraticCurveTo(tl - inc * 1, base + high, tl - inc * 2, base);
    ctx.quadraticCurveTo(tl - inc * 3, base + low, tl - inc * 4, base);
    ctx.quadraticCurveTo(tl - inc * 5, base + high, tl - inc * 6, base);
    ctx.quadraticCurveTo(tl - inc * 7, base + low, tl - inc * 8, base);
    ctx.quadraticCurveTo(tl - inc * 9, base + high, tl - inc * 10, base);

    ctx.closePath();
    ctx.fill();

    // Eyes - whites
    ctx.beginPath();
    ctx.fillStyle = "#FFF";
    ctx.arc(left + 6, top + 6, s / 6, 0, Math.PI * 2);
    ctx.arc(left + s - 6, top + 6, s / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // Eyes - pupils
    const f = s / 12;
    const offsets: Record<"LEFT" | "RIGHT" | "UP" | "DOWN", [number, number]> =
      {
        RIGHT: [f, 0],
        LEFT: [-f, 0],
        UP: [0, -f],
        DOWN: [0, f],
      };

    const [dx, dy] = offsets[dir];

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(left + 6 + dx, top + 6 + dy, s / 15, 0, Math.PI * 2);
    ctx.arc(left + s - 6 + dx, top + 6 + dy, s / 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}

export { Ghost };
