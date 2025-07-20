import { LEVEL_CONFIGS } from "../config/levels.js";
import { EntityManager } from "../entities/entityManager.js";
import type { LevelConfigType } from "../types.js";

class GameState {
  private static instance: GameState;
  private entityManager: EntityManager;

  isRunning: boolean;
  lives: number;
  score: number;
  currentLevel: number;
  levelData: LevelConfigType;
  foodMap: Set<string>;

  private constructor() {
    this.entityManager = EntityManager.getInstance();
    this.isRunning = false;
    this.lives = 3;
    this.score = 0;
    this.currentLevel = 1;
    this.levelData = LEVEL_CONFIGS[1];
    this.foodMap = new Set();
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

    this.entityManager.resetEntities();
    this.entityManager.initEntities();
  }

  public nextLevel() {
    this.currentLevel++;
    this.loadLevel();
  }

  public startGame() {
    this.isRunning = true;
    this.entityManager.createEntities();
    this.loadLevel();
  }

  public resetGame() {
    this.lives = 3;
    this.currentLevel = 1;
    this.levelData = this.getLevelConfig(this.currentLevel);
  }
}

export { GameState };
