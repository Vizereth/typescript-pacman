import type { TileType } from "./types.js";

function setCanvasSize(
  canvas: HTMLCanvasElement,
  BLOCK_SIZE: number,
  EXTRA_HEIGHT_FACTOR: number,
  map: TileType[][]
) {
  const rows = map.length;
  const cols = map[0]?.length || 0; 

  canvas.width = cols * BLOCK_SIZE;
  canvas.height = rows * BLOCK_SIZE + BLOCK_SIZE * EXTRA_HEIGHT_FACTOR;
}

export { setCanvasSize };
