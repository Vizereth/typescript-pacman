import { GHOSTS_CONFIG } from "../config/entities.js";

import type { StaticEntitiesType, DynamicEntitiesType } from "../types.js";

import { Entity } from "./entity.js";
import { Map } from "../map/map.js";
import { Food } from "../map/food.js";
import { Pill } from "../map/pill.js";
import { UI } from "../ui/ui.js";
import { Pacman } from "./pacman.js";
import { Ghost } from "./ghost.js";

class EntityManager {
  private static instance: EntityManager | null = null;

  private staticEntities!: StaticEntitiesType;
  private dynamicEntities!: DynamicEntitiesType;

  private constructor() {}

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
      ghosts: [
        new Ghost(GHOSTS_CONFIG.blinky.name, GHOSTS_CONFIG.blinky.color),
        new Ghost(GHOSTS_CONFIG.pinky.name, GHOSTS_CONFIG.pinky.color),
        new Ghost(GHOSTS_CONFIG.inky.name, GHOSTS_CONFIG.inky.color),
        new Ghost(GHOSTS_CONFIG.clyde.name, GHOSTS_CONFIG.clyde.color),
      ],
      pill: new Pill(),
    };
  }

  public getDynamicEntity<K extends keyof DynamicEntitiesType>(
    key: K
  ): DynamicEntitiesType[K] {
    return this.dynamicEntities[key];
  }

  public getDynamicEntities(): DynamicEntitiesType {
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
    Object.entries({ ...this.staticEntities, ...this.dynamicEntities }).forEach(
      ([key, entity]) => {
        if (Array.isArray(entity)) {
          entity.forEach((item) => {
            if ("init" in item && typeof item.init === "function") {
              item.init();
            }
          });
        } else if ("init" in entity && typeof entity.init === "function") {
          entity.init();
        }
      }
    );
  }

  public resetEntities(): void {
    Object.entries({ ...this.staticEntities, ...this.dynamicEntities }).forEach(
      ([key, entity]) => {
        if (Array.isArray(entity)) {
          entity.forEach((item) => {
            if ("reset" in item && typeof item.reset === "function") {
              item.reset();
            }
          });
        } else if ("reset" in entity && typeof entity.reset === "function") {
          entity.reset();
        }
      }
    );
  }
}

export { EntityManager };
