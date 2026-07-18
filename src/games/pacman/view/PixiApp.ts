// src/game/view/PixiApp.ts
import { Application, type Container, type Ticker } from 'pixi.js';

export class PixiApp {
  public readonly app: Application;

  constructor() {
    this.app = new Application();
  }

  /**
   * Initializes the Pixi v8 renderer and mounts it to the DOM.
   */
  public async init(canvasParent: HTMLDivElement): Promise<void> {
    await this.app.init({
      resizeTo: canvasParent,
      background: '#050508', // Pixi v8 uses 'background' instead of 'backgroundColor'
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    canvasParent.appendChild(this.app.canvas);
  }

  public get stage(): Container {
    return this.app.stage;
  }

  public get ticker(): Ticker {
    return this.app.ticker;
  }

  public destroy(): void {
    this.app.destroy(true, { children: true });
  }
}