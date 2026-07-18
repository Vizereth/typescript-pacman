/**
 * Game availability status for the Arcade launcher.
 */
export const GameStatus = {
  AVAILABLE: "AVAILABLE",
  COMING_SOON: "COMING_SOON",
  IN_DEVELOPMENT: "IN_DEVELOPMENT",
} as const;

export type GameStatusType = typeof GameStatus[keyof typeof GameStatus];

/**
 * Internal game lifecycle states.
 * Managed by each game's state machine and pushed to the UI via UIBridge.
 */
export const GameState = {
  BOOTING: "BOOTING",
  READY: "READY",
  MENU: "MENU",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  GAME_OVER: "GAME_OVER",
  LEVEL_TRANSITION: "LEVEL_TRANSITION",
} as const;

export type GameStateType = typeof GameState[keyof typeof GameState];

/**
 * Contract between a game's internal systems and the Svelte UI layer.
 */
export interface UIBridge {
  onScoreUpdate(score: number): void;
  onLivesUpdate(lives: number): void;
  onStateChange(state: GameStateType): void;
  onMessage(message: string): void;
}

/**
 * Unified contract for all games in the Arcade.
 */
export interface GameModule {
  init(canvasParent: HTMLDivElement, ui: UIBridge): Promise<void>;
  destroy(): void;
}