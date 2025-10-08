import { EntityManager } from "../entities/entityManager.js";

class Renderer {
  private static instance: Renderer | null = null;
  private entityManager = EntityManager.getInstance();

  private constructor() {}

  public static getInstance(): Renderer {
    if (!Renderer.instance) {
      Renderer.instance = new Renderer();
    }
    return Renderer.instance;
  }

  public render(dt?: number): void {
    const clearedCanvases = new Set<HTMLCanvasElement>();

    this.entityManager.getAllDynamic().forEach((entity) => {
      if (!clearedCanvases.has(entity.canvas)) {
        entity.clearCanvas();
        clearedCanvases.add(entity.canvas);
      }
      entity.update(dt);
    });

    this.entityManager
      .getAllStatic()
      .filter((entity) => entity.needsRedraw)
      .forEach((entity) => {
        if (!clearedCanvases.has(entity.canvas)) {
          entity.clearCanvas();
          clearedCanvases.add(entity.canvas);
        }
        entity.update(dt);
        entity.needsRedraw = false;
      });
  }
}

export { Renderer };
