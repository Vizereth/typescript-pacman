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

  public getDynamicEntity<K extends keyof typeof this.dynamicEntities>(
    key: K
  ): EntityArray {
    return this.dynamicEntities[key];
  }

  public getStaticEntity<K extends keyof typeof this.staticEntities>(
    key: K
  ): EntityArray {
    return this.staticEntities[key];
  }

  public initAll(): void {
    [...this.getAllStatic(), ...this.getAllDynamic()].forEach((e) => e.init());
  }

  public resetAll(): void {
    [...this.getAllStatic(), ...this.getAllDynamic()].forEach((e) => e.reset());
  }
}

export { EntityManager };
