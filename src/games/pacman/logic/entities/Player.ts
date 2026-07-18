import {
  InputBufferComponent,
  MotionComponent,
  type Vector2D,
} from "../components/MotionComponent.js";
import type { GridMatrix } from "../grid/GridMatrix.js";
import type { GridSystem } from "../grid/GridSystem.js";

export class Player {
  public readonly id: string;
  public readonly motion: MotionComponent;
  public readonly inputBuffer: InputBufferComponent;

  // Injected strict configuration properties
  private baseSpeed: number = 0.12; // Base tiles traversed per frame step
  private kinematicPropelFriction: number = 0.92; // Friction decay tracking factor for teleporters

  /**
   * Complete Constructor Dependency Injection pattern. No Singletons permitted.
   * @param id Unique entity instance identifier
   * @param spawnGridX Initial grid column index
   * @param spawnGridY Initial grid row index
   */
  constructor(id: string, spawnGridX: number, spawnGridY: number) {
    this.id = id;
    this.motion = new MotionComponent();
    this.inputBuffer = new InputBufferComponent();

    // Map starting coordinates inside the 36px logic scale
    this.motion.gridX = spawnGridX;
    this.motion.gridY = spawnGridY;
    this.motion.subX = 0.5; // Centered inside the bounding node
    this.motion.subY = 0.5;
  }

  /**
   * Explicit input capture bypassing the asynchronous EventBus boundary entirely.
   * Directly called by the central Input Manager layer.
   */
  public registerDirectInput(
    headingX: number,
    headingY: number,
    currentTimestamp: number,
  ): void {
    this.inputBuffer.bufferedHeadingX = headingX;
    this.inputBuffer.bufferedHeadingY = headingY;
    this.inputBuffer.bufferTimestamp = currentTimestamp;
  }

  /**
   * Central deterministic frame iteration algorithm.
   * Framerate independent calculations are driven directly by injected delta values.
   * @param deltaTime Scaled frame differential step
   * @param gridRef Direct reference to the active layout data matrix
   * @param gridSystem Direct reference to the stateless spatial engine query layer
   */
  public update(
    deltaTime: number,
    gridRef: GridMatrix,
    gridSystem: GridSystem,
  ): void {
    const currentTimestamp = performance.now();

    // 1. Evaluate Input Buffering Window Validity
    let targetX = this.motion.headingX;
    let targetY = this.motion.headingY;

    if (
      currentTimestamp - this.inputBuffer.bufferTimestamp <=
      this.inputBuffer.BUFFER_WINDOW_MS
    ) {
      // Look ahead query delegated entirely to the external GridSystem engine boundary
      const isBufferedTurnValid = gridSystem.canSnapToTrajectory(
        this.motion.gridX,
        this.motion.gridY,
        this.inputBuffer.bufferedHeadingX,
        this.inputBuffer.bufferedHeadingY,
        gridRef,
        false, // Pac-Man cannot enter the ghost lair entrance node ('LE')
      );

      if (isBufferedTurnValid) {
        targetX = this.inputBuffer.bufferedHeadingX;
        targetY = this.inputBuffer.bufferedHeadingY;
      }
    }

    // 2. Continuous Movement Calculations & Bounding Wall Check
    const isTargetTrajectoryValid = gridSystem.canSnapToTrajectory(
      this.motion.gridX,
      this.motion.gridY,
      targetX,
      targetY,
      gridRef,
      false,
    );

    if (isTargetTrajectoryValid) {
      this.motion.headingX = targetX;
      this.motion.headingY = targetY;

      // Accumulate velocity components along active vector trajectories
      this.motion.velocityX = this.motion.headingX * this.baseSpeed;
      this.motion.velocityY = this.motion.headingY * this.baseSpeed;
    } else {
      // Current trajectory blocked by an un-walkable tile context—evaluate keeping current heading or halting
      const isCurrentHeadingValid = gridSystem.canSnapToTrajectory(
        this.motion.gridX,
        this.motion.gridY,
        this.motion.headingX,
        this.motion.headingY,
        gridRef,
        false,
      );

      if (!isCurrentHeadingValid) {
        // Wall collision met - arrest forward momentum immediately
        this.motion.velocityX = 0;
        this.motion.velocityY = 0;
      }
    }

    // 3. Integrate Framerate Independent Velocity
    this.motion.subX += this.motion.velocityX * deltaTime;
    this.motion.subY += this.motion.velocityY * deltaTime;

    // 4. Resolve Sub-pixel 36px Tile Snapping and Crossings
    this.resolveTileBoundaries();

    // 5. Apply Kinematic Friction Decay on teleporter-driven propulsion vectors
    if (
      Math.abs(this.motion.velocityX) > this.baseSpeed ||
      Math.abs(this.motion.velocityY) > this.baseSpeed
    ) {
      this.motion.velocityX *= Math.pow(
        this.kinematicPropelFriction,
        deltaTime,
      );
      this.motion.velocityY *= Math.pow(
        this.kinematicPropelFriction,
        deltaTime,
      );
    }
  }

  /**
   * Continuous axis clipping tracker ensuring the bounding box snaps seamlessly
   * across logical cell borders.
   */
  private resolveTileBoundaries(): void {
    // Check horizontal axis overflow triggers
    if (this.motion.subX >= 1.0) {
      this.motion.gridX += 1;
      this.motion.subX -= 1.0;
    } else if (this.motion.subX < 0.0) {
      this.motion.gridX -= 1;
      this.motion.subX += 1.0;
    }

    // Check vertical axis overflow triggers
    if (this.motion.subY >= 1.0) {
      this.motion.gridY += 1;
      this.motion.subY -= 1.0;
    } else if (this.motion.subY < 0.0) {
      this.motion.gridY -= 1;
      this.motion.subY += 1.0;
    }
  }

  /**
   * Direct coordinate mutation interface for instantaneous kinematic teleportation.
   */
  public forcePositionTranslation(
    gridCoords: Vector2D,
    velocityBoost: Vector2D,
  ): void {
    this.motion.gridX = gridCoords.x;
    this.motion.gridY = gridCoords.y;
    this.motion.subX = 0.5;
    this.motion.subY = 0.5;

    // Inject maximum propel force directly onto the entity
    this.motion.velocityX = velocityBoost.x;
    this.motion.velocityY = velocityBoost.y;
  }
}
