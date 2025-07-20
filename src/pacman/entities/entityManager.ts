import { Entity } from "./entity.js";
import type { StaticEntitiesType, DynamicEntitiesType } from "../types.js";
import { Map } from "../map/map.js";
import { Food } from "../map/food.js";
import { Pill } from "../map/pill.js";
import { UI } from "../ui/ui.js";
import { Pacman } from "./pacman.js";

class EntityManager {
  private static instance: EntityManager | null = null;

  private staticEntities!: StaticEntitiesType;
  private dynamicEntities!: DynamicEntitiesType;

  private constructor() {

  }

  public static getInstance(): EntityManager {
    if (!EntityManager.instance) {
      EntityManager.instance = new EntityManager();
    }

    return EntityManager.instance;
  }

  public createEntities(): void {
    this.staticEntities = {
      food: new Food(),
      ui: new UI(),
      map: new Map(),
    };

    this.dynamicEntities = {
      pacman: new Pacman(),
      pill: new Pill(),
    };
  }

  public getDynamicEntity<K extends keyof DynamicEntitiesType>(
    key: K
  ): DynamicEntitiesType[K] {
    return this.dynamicEntities[key];
  }

  public getDynamicEntities(): Record<string, Entity> {
    return this.dynamicEntities;
  }

  public getStaticEntity<K extends keyof StaticEntitiesType>(
    key: K
  ): StaticEntitiesType[K] {
    return this.staticEntities[key];
  }

  public getStaticEntities(): Record<string, Entity> {
    return this.staticEntities;
  }

  public getStaticEntitiesNeedingRedraw(): Entity[] {
    return Object.values(this.staticEntities).filter(
      (entity) => entity.needsRedraw
    );
  }

  public initEntities(): void {
    Object.values({ ...this.dynamicEntities, ...this.staticEntities }).forEach(
      (entity) => {
        if ("init" in entity && typeof entity.init === "function") {
          entity.init();
        }
      }
    );
  }

  public resetEntities(): void {
    Object.values({ ...this.dynamicEntities, ...this.staticEntities }).forEach(
      (entity) => {
        if ("reset" in entity && typeof entity.reset === "function") {
          entity.reset();
        }
      }
    );
  }
}

export { EntityManager };
