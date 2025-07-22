import { EntityManager } from "../entities/entityManager.js";

class Renderer {
  private static instance: Renderer | null;
  private entityManager;

  private constructor() {
    this.entityManager = EntityManager.getInstance();
  }

  static getInstance(): Renderer {
    if (!Renderer.instance) {
      Renderer.instance = new Renderer();
    }

    return Renderer.instance;
  }

  render() {
    const clearedCanvases = new Set<HTMLCanvasElement>();

    Object.values(this.entityManager.getDynamicEntities())
      .flat()
      .forEach((entity) => {
        if (!clearedCanvases.has(entity.canvas)) {
          entity.clearCanvas();
          clearedCanvases.add(entity.canvas);
        }
        entity.update();
      });

    this.entityManager.getStaticEntitiesNeedingRedraw().forEach((entity) => {
      if (!clearedCanvases.has(entity.canvas)) {
        entity.clearCanvas();
        clearedCanvases.add(entity.canvas);
      }
      entity.update();
      entity.needsRedraw = false;
    });
  }
}

export { Renderer };
