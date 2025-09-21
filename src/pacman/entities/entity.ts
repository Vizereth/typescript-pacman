import { CANVAS_CONFIG } from "../config/canvas.js";
import { MAP_LVL_1 } from "../config/maps.js";
import { setCanvasSize } from "../utils.js";

abstract class Entity {
  layer: string;
  tileSize: number;
  isDynamic: boolean;
  needsRedraw: boolean;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(layer: string, isDynamic: boolean = false) {
    this.layer = layer;
    this.tileSize = CANVAS_CONFIG.tile.size;
    this.isDynamic = isDynamic;
    this.needsRedraw = true;

    const canvas = document.getElementById(
      this.layer
    ) as HTMLCanvasElement | null;
    if (!canvas) throw new Error(`Canvas ${this.layer} not found.`);
    this.canvas = canvas;

    setCanvasSize(
      canvas,
      CANVAS_CONFIG.tile.size,
      CANVAS_CONFIG.tile.extraHeightFactor,
      MAP_LVL_1
    );

    const context = this.canvas.getContext("2d");
    if (!context) throw new Error("Failed to get 2D context.");
    this.ctx = context;
  }

  clearCanvas(
    x: number = 0,
    y: number = 0,
    width: number = this.canvas.width,
    height: number = this.canvas.height
  ) {
    this.ctx.clearRect(x, y, width, height);
  }

  requestRedraw(): void {
    if (!this.isDynamic) {
      this.needsRedraw = true;
    }
  }

  abstract update(): void;
}

export { Entity };
