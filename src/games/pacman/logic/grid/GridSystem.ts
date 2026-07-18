import type { GridMatrix, TeleportType } from "./GridMatrix.js";

export interface GridCoordinate {
  x: number;
  y: number;
}

export class GridSystem {
  /**
   * Validates whether a spatial coordinate is walkable by entities.
   * @param allowLairEntrance Direct toggle to let ghosts navigate through 'LE' gates.
   */
  public isWalkable(
    gridX: number,
    gridY: number,
    gridMatrix: GridMatrix,
    allowLairEntrance: boolean = false,
  ): boolean {
    const tile = gridMatrix.getTileAt(gridX, gridY);

    if (tile === "WL" || tile === "ES") return false;
    if (tile === "LE" && !allowLairEntrance) return false;

    return true;
  }

  /**
   * Scans the grid context to resolve the coordinate layout of a matching wormhole pair.
   */
  public findWormholeExit(
    currentToken: TeleportType,
    entryX: number,
    entryY: number,
    gridMatrix: GridMatrix,
  ): GridCoordinate | null {
    for (let y = 0; y < gridMatrix.height; y++) {
      for (let x = 0; x < gridMatrix.width; x++) {
        if (
          gridMatrix.getTileAt(x, y) === currentToken &&
          (x !== entryX || y !== entryY)
        ) {
          return { x, y };
        }
      }
    }
    return null;
  }

  /**
   * Evaluates and builds a linear lookahead trajectory map array for input/AI buffers.
   */
  public canSnapToTrajectory(
    currentX: number,
    currentY: number,
    headingX: number,
    headingY: number,
    gridMatrix: GridMatrix,
    allowLair: boolean = false,
  ): boolean {
    if (headingX === 0 && headingY === 0) return true;
    return this.isWalkable(
      currentX + headingX,
      currentY + headingY,
      gridMatrix,
      allowLair,
    );
  }

  /**
   * High-Frequency, memory-optimized A* Graph-Search routine used by the UltraGhost Sub-boss.
   * Uses simple squared Euclidian distance equations instead of expensive square roots.
   */
  public findPathAStar(
    start: GridCoordinate,
    target: GridCoordinate,
    gridMatrix: GridMatrix,
    allowLair: boolean = false,
  ): GridCoordinate[] {
    const directions: GridCoordinate[] = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];

    const serialize = (pt: GridCoordinate) => `${pt.x},${pt.y}`;

    const openSet: GridCoordinate[] = [start];
    const cameFrom = new Map<string, string>();

    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    gScore.set(serialize(start), 0);
    fScore.set(serialize(start), this.getDistanceSquared(start, target));

    while (openSet.length > 0) {
      // Find node in openSet with lowest fScore
      let currentIndex = 0;
      let lowestF = fScore.get(serialize(openSet[0])) ?? Infinity;

      for (let i = 1; i < openSet.length; i++) {
        const score = fScore.get(serialize(openSet[i])) ?? Infinity;
        if (score < lowestF) {
          lowestF = score;
          currentIndex = i;
        }
      }

      const current = openSet[currentIndex];

      if (current.x === target.x && current.y === target.y) {
        return this.reconstructPath(cameFrom, current);
      }

      openSet.splice(currentIndex, 1);
      const currentKey = serialize(current);
      const currentG = gScore.get(currentKey) ?? Infinity;

      for (const dir of directions) {
        const neighbor: GridCoordinate = {
          x: current.x + dir.x,
          y: current.y + dir.y,
        };

        if (!this.isWalkable(neighbor.x, neighbor.y, gridMatrix, allowLair)) {
          continue;
        }

        const neighborKey = serialize(neighbor);
        const tentativeGScore = currentG + 1; // All steps uniformly cost 1 step unit

        if (tentativeGScore < (gScore.get(neighborKey) ?? Infinity)) {
          cameFrom.set(neighborKey, currentKey);
          gScore.set(neighborKey, tentativeGScore);
          fScore.set(
            neighborKey,
            tentativeGScore + this.getDistanceSquared(neighbor, target),
          );

          if (
            !openSet.some((pt) => pt.x === neighbor.x && pt.y === neighbor.y)
          ) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return []; // No viable path found
  }

  private getDistanceSquared(a: GridCoordinate, b: GridCoordinate): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return dx * dx + dy * dy;
  }

  private reconstructPath(
    cameFrom: Map<string, string>,
    current: GridCoordinate,
  ): GridCoordinate[] {
    const totalPath: GridCoordinate[] = [current];
    let currentKey = `${current.x},${current.y}`;

    while (cameFrom.has(currentKey)) {
      currentKey = cameFrom.get(currentKey)!;
      const [x, y] = currentKey.split(",").map(Number);
      totalPath.unshift({ x, y });
    }
    return totalPath;
  }
}
