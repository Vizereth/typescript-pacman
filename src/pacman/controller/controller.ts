import { EntityManager } from "../entities/entityManager.js";
import { Pacman } from "../entities/pacman.js";
import { GameState } from "../game/state.js";

class Controller {
  private x1: number | null;
  private y1: number | null;
  private pacman: Pacman;
  private gameState: GameState;

  constructor() {
    this.x1 = null;
    this.y1 = null;
    this.gameState = GameState.getInstance();
    this.pacman = EntityManager.getInstance().getPacman();
  }

  init() {
    window.addEventListener("touchstart", this.touchStart.bind(this), {
      passive: false,
    });
    window.addEventListener("touchend", this.touchEnd.bind(this), {
      passive: false,
    });
    window.addEventListener("touchcancel", this.touchCancel.bind(this), {
      passive: false,
    });
    window.addEventListener("keydown", this.keyDown.bind(this));
  }

  touchCancel() {
    this.x1 = this.y1 = null; 
  }

  touchStart(event: TouchEvent) {
    event.preventDefault();
    this.x1 = event.touches[0].clientX;
    this.y1 = event.touches[0].clientY;
  }

  touchEnd(event: TouchEvent) {
    if (this.x1 === null || this.y1 === null) return;

    event.preventDefault();
    const x2 = event.changedTouches[0].clientX;
    const y2 = event.changedTouches[0].clientY;

    const dx = Math.abs(x2 - this.x1);
    const dy = Math.abs(y2 - this.y1);

    if (dx > dy) {
      this.pacman.direction =
        x2 > this.x1 ? { dx: 1, dy: 0 } : { dx: -1, dy: 0 };
    } else {
      this.pacman.direction =
        y2 > this.y1 ? { dx: 0, dy: 1 } : { dx: 0, dy: -1 };
    }

    this.x1 = this.y1 = null;
  }

  keyDown(event: KeyboardEvent) {
    event.preventDefault();

    if (event.key === "ENTER" && !this.gameState.isRunning) {
      this.startGame();
      return;
    }

    if (!this.gameState.isRunning) return;

    let newDirection = { dx: 0, dy: 0 };

    switch (event.key) {
      case "ArrowLeft":
        newDirection = { dx: -1, dy: 0 };
        break;
      case "ArrowUp":
        newDirection = { dx: 0, dy: -1 };
        break;
      case "ArrowRight":
        newDirection = { dx: 1, dy: 0 };
        break;
      case "ArrowDown":
        newDirection = { dx: 0, dy: 1 };
        break;
      default:
        break;
    }

    this.pacman.changeDirection(newDirection);
  }

  startGame() {
    this.gameState.startGame();
  }
}

export { Controller };
