import type { Entity } from "./entity.js";
import { Food } from "../map/food.js";
import { Map } from "../map/map.js";
import { Pill } from "../map/pill.js";
import { UI } from "../ui/ui.js";
import { Pacman } from "./pacman.js";
import { Ghost } from "./ghost.js";
import { GHOSTS_CONFIG } from "../config/entities.js";

type EntityArray = Entity[];

class EntityManager {
  private static instance: EntityManager | null = null;

  public dynamicEntities: Record<string, EntityArray> = {};
  public staticEntities: Record<string, EntityArray> = {};

  private constructor() {}

  public static getInstance(): EntityManager {
    if (!EntityManager.instance) {
      EntityManager.instance = new EntityManager();
    }
    return EntityManager.instance;
  }

  public createEntities(): void {
    this.staticEntities = {
      food: [new Food()],
      ui: [new UI()],
      map: [new Map()],
    };

    this.dynamicEntities = {
      pacman: [new Pacman()],
      ghosts: Object.values(GHOSTS_CONFIG).map(
        ({ name, color }) => new Ghost(name, color)
      ),
      pill: [new Pill()],
    };
  }

  public getAllDynamic(): Entity[] {
    return Object.values(this.dynamicEntities).flat();
  }

  public getAllStatic(): Entity[] {
    return Object.values(this.staticEntities).flat();
  }

  public getFood(): Food {
    return this.staticEntities.food[0] as Food;
  }

  public getPill(): Pill {
    return this.dynamicEntities.pill[0] as Pill;
  }

  public getPacman(): Pacman {
    return this.dynamicEntities.pacman[0] as Pacman;
  }

  public getGhosts(): Ghost[] {
    return this.dynamicEntities.ghosts as Ghost[];
  }

  public initAll(): void {
    [...this.getAllStatic(), ...this.getAllDynamic()].forEach((e) => e.init());
  }

  public resetAll(): void {
    [...this.getAllStatic(), ...this.getAllDynamic()].forEach((e) => e.reset());
  }
}

export { EntityManager };
