// src/shared/core/GameLoop.ts
import type { Ticker } from "pixi.js";

export type UpdateCallback = (deltaMS: number) => void;

export class GameLoop {
  private updateFn: UpdateCallback | null = null;

  constructor(private readonly ticker: Ticker) {}

  public start(updateFn: UpdateCallback): void {
    this.updateFn = updateFn;
    this.ticker.add(this.tick, this);
  }

  private tick = (): void => {
    if (this.updateFn) {
      this.updateFn(this.ticker.deltaMS);
    }
  };

  public stop(): void {
    this.ticker.remove(this.tick, this);
    this.updateFn = null;
  }

  public destroy(): void {
    this.stop();
  }
}