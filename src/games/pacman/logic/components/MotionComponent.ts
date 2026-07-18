// src/logic/components/MotionComponent.ts
export interface Vector2D {
  x: number;
  y: number;
}

export class MotionComponent {
  // Logical grid coordinates (0-indexed tile markers)
  public gridX: number = 0;
  public gridY: number = 0;

  // Sub-pixel continuous spatial positions within the 36px space
  public subX: number = 0;
  public subY: number = 0;

  // Real-time kinematic velocity tracking vectors
  public velocityX: number = 0;
  public velocityY: number = 0;

  // Current orientation vector
  public headingX: number = 0;
  public headingY: number = 0;
}

// src/logic/components/InputBufferComponent.ts
export class InputBufferComponent {
  public bufferedHeadingX: number = 0;
  public bufferedHeadingY: number = 0;
  public bufferTimestamp: number = 0;
  public readonly BUFFER_WINDOW_MS: number = 200; // 200ms pre-turn cornering window
}