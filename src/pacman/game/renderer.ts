import { EntityManager } from "../entities/entityManager.js";

class Renderer {
  private static instance: Renderer | null;
  entityManager;

  constructor() {
    this.entityManager = EntityManager.getInstance();
  }

  static getInstance(): Renderer {
    if (!Renderer.instance) {
      Renderer.instance = new Renderer();
    }

    return Renderer.instance;
  }

  render() {
    Object.values(this.entityManager.getDynamicEntities()).forEach((entity) => {
      entity.clearCanvas();
      entity.update();
    });

    Object.values(this.entityManager.getStaticEntitiesNeedingRedraw()).forEach(
      (entity) => {
        entity.clearCanvas();
        entity.update();
        entity.needsRedraw = false;
      }
    );
  }
}

export { Renderer };
