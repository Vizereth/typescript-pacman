import { LEVEL_CONFIGS } from "../config/levels.js";
import { SCORE_CONFIG } from "../config/scoring.js";
import { EntityManager } from "../entities/entityManager.js";
import type { LevelConfigType } from "../types.js";
import { GameLoop } from "./loop.js";
import { Renderer } from "./renderer.js";

class GameState {
  private static instance: GameState;
  private entityManager: EntityManager;
  private gameLoop: GameLoop;

  public isRunning: boolean;
  public lives: number;
  public currentLevel: number;
  public levelData: LevelConfigType;

  public score: number;
  public ghostMultiplier: number;

  private constructor() {
    this.entityManager = EntityManager.getInstance();
    this.gameLoop = GameLoop.getInstance();
    this.isRunning = false;
    this.lives = 3;
    this.currentLevel = 1;
    this.levelData = LEVEL_CONFIGS[1];

    this.score = 0;
    this.ghostMultiplier = 0;
  }

  static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  private getLevelConfig(level: number): LevelConfigType {
    return LEVEL_CONFIGS[level] || LEVEL_CONFIGS[1];
  }

  public loadLevel() {
    this.levelData = this.getLevelConfig(this.currentLevel);
    this.entityManager.resetAll();
    this.entityManager.initAll();
  }

  public nextLevel() {
    this.currentLevel++;
    this.loadLevel();
  }

  public loadGame() {
    this.entityManager.createEntities();
    this.loadLevel();
    this.gameLoop.start();
  }

  public startGame() {
    this.isRunning = true;
    this.entityManager.spawnAll();
  }

  public endGame() {
    this.resetGame();
  }

  public resetGame() {
    this.lives = 3;
    this.currentLevel = 1;
    this.levelData = this.getLevelConfig(this.currentLevel);
  }

  public loseLife() {
    this.lives--;

    if (this.lives === 0) {
      this.endGame();
    }
  }

  public updateScore(type: string) {
    switch (type) {
      case "DOT":
        this.score += SCORE_CONFIG.DOTS.PELLET;
        break;
      case "POWER_PELLET":
        this.score += SCORE_CONFIG.DOTS.POWER_PELLET;
        break;
      case "GHOST":
        this.score +=
          SCORE_CONFIG.GHOSTS.BASE *
          SCORE_CONFIG.GHOSTS.MULTIPLIERS[this.ghostMultiplier];
        this.ghostMultiplier++;
      default:
        break;
    }
  }

  public resetGhostMultiplier() {
    this.ghostMultiplier = 0;
  }
}

export { GameState };
