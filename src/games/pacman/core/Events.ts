// src/game/core/Events.ts

// ═══════════════════════════════════════════════════════════════
// EVENT PAYLOAD INTERFACES
// ═══════════════════════════════════════════════════════════════

// ── Lifecycle ────────────────────────────────────────────────
export interface StateChangedPayload {
  previous: string;
  current: string;
}

// ── Player ───────────────────────────────────────────────────
export interface PlayerDiedPayload {
  entityId: string;
  x: number;
  y: number;
}

export interface PlayerTeleportedPayload {
  entityId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  token: string; // TeleportType token, e.g., "0A"
}

export interface PlayerBuffAppliedPayload {
  entityId: string;
  buffType: "INVINCIBILITY" | "VELOCITY_PROPEL" | "HYPNOTIZE_GHOSTS";
  durationMs: number;
}

export interface PlayerBuffExpiredPayload {
  entityId: string;
  buffType: "INVINCIBILITY" | "VELOCITY_PROPEL" | "HYPNOTIZE_GHOSTS";
}

// ── Ghosts ───────────────────────────────────────────────────
export interface GhostHypnotizedPayload {
  entityId: string;
  ghostType: "BLINKY" | "PINKY" | "INKY" | "CLYDE";
}

export interface GhostEatenPayload {
  entityId: string;
  ghostType: "BLINKY" | "PINKY" | "INKY" | "CLYDE";
  pointsAwarded: number;
}

export interface GhostRespawnedPayload {
  entityId: string;
  ghostType: "BLINKY" | "PINKY" | "INKY" | "CLYDE";
}

// ── UltraGhost ───────────────────────────────────────────────
export interface UltraGhostSpawnedPayload {
  entityId: string;
  level: number;
}

export interface UltraGhostDefeatedPayload {
  entityId: string;
  method: "LAIR_TRAP" | "HYPNOTIZED";
  pointsAwarded: number;
}

export interface EventHorizonStartPayload {
  convergenceX: number;
  convergenceY: number;
  ghostEntityIds: string[];
}

export interface EventHorizonEndPayload {
  ultraGhostEntityId: string;
}

// ── Collectibles ─────────────────────────────────────────────
export type CollectibleType =
  | "STAR_DOT"
  | "GLOW_EMBER_PILL"
  | "QUEST_FRUIT"
  | "BONUS_LIFE"
  | "ROAMING_BOOSTER"
  | "GRAVITATIONAL_PULSE"
  | "COSMIC_RESET"
  | "GOLDEN_COSMIC_EGG";

export interface CollectiblePickedUpPayload {
  collectibleId: string;
  type: CollectibleType;
  gridX: number;
  gridY: number;
  pointsAwarded: number;
}

export interface CollectibleSpawnedPayload {
  collectibleId: string;
  type: CollectibleType;
  gridX: number;
  gridY: number;
}

export interface CollectibleDespawnedPayload {
  collectibleId: string;
  type: CollectibleType;
  reason: "PICKED_UP" | "TIMEOUT" | "DEATH_WAVE";
}

// ── Level & Game Flow ────────────────────────────────────────
export interface LevelStartedPayload {
  level: number;
  blueprintId: string;
}

export interface LevelCompletedPayload {
  level: number;
  timeCompletedMs: number;
  dotsRemaining: number;
  bonusPoints: number;
}

export interface LevelRebuiltPayload {
  level: number;
  reason: "PLAYER_DEATH" | "COSMIC_RESET";
}

export interface GameOverPayload {
  finalScore: number;
  levelReached: number;
}

// ── Death Wave ───────────────────────────────────────────────
export interface DeathWaveStartedPayload {
  originX: number;
  originY: number;
  velocityPxPerSec: number;
}

export interface DeathWaveEntityShatteredPayload {
  entityId: string;
  entityType: "PLAYER" | "GHOST" | "ULTRA_GHOST" | "COLLECTIBLE";
  waveRadiusAtShatter: number;
}

export interface DeathWaveCompletedPayload {
  originX: number;
  originY: number;
}

// ── Scoring & Stats (UI Sync) ────────────────────────────────
export interface ScoreChangedPayload {
  previousScore: number;
  newScore: number;
  delta: number;
  source: "DOT" | "GHOST" | "FRUIT" | "ULTRA_GHOST" | "LEVEL_COMPLETE" | "GOLDEN_EGG";
}

export interface LivesChangedPayload {
  previousLives: number;
  newLives: number;
}

export interface HighScoreBrokenPayload {
  newHighScore: number;
}

// ── Save State ───────────────────────────────────────────────
export interface SaveStateCapturedPayload {
  level: number;
  timestamp: number;
}

export interface SaveStateAppliedPayload {
  level: number;
  restoredDots: number;
  restoredPills: number;
}

// ── Audio ────────────────────────────────────────────────────
export interface SfxPlayPayload {
  cue: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
  channel: "AMBIENT" | "SFX" | "MUSIC" | "UI";
}

export interface AudioUnlockedPayload {
  timestamp: number;
}

// ═══════════════════════════════════════════════════════════════
// EVENT MAP (Single source of truth)
// ═══════════════════════════════════════════════════════════════

export interface GameEventMap {
  // Lifecycle
  "lifecycle:state_changed": StateChangedPayload;

  // Player
  "player:died": PlayerDiedPayload;
  "player:teleported": PlayerTeleportedPayload;
  "player:buff_applied": PlayerBuffAppliedPayload;
  "player:buff_expired": PlayerBuffExpiredPayload;

  // Ghosts
  "ghost:hypnotized": GhostHypnotizedPayload;
  "ghost:eaten": GhostEatenPayload;
  "ghost:respawned": GhostRespawnedPayload;

  // UltraGhost
  "ultra_ghost:spawned": UltraGhostSpawnedPayload;
  "ultra_ghost:defeated": UltraGhostDefeatedPayload;
  "ultra_ghost:event_horizon_start": EventHorizonStartPayload;
  "ultra_ghost:event_horizon_end": EventHorizonEndPayload;

  // Collectibles
  "collectible:picked_up": CollectiblePickedUpPayload;
  "collectible:spawned": CollectibleSpawnedPayload;
  "collectible:despawned": CollectibleDespawnedPayload;

  // Level & Game Flow
  "level:started": LevelStartedPayload;
  "level:completed": LevelCompletedPayload;
  "level:rebuilt": LevelRebuiltPayload;
  "game:over": GameOverPayload;

  // Death Wave
  "death_wave:started": DeathWaveStartedPayload;
  "death_wave:entity_shattered": DeathWaveEntityShatteredPayload;
  "death_wave:completed": DeathWaveCompletedPayload;

  // Scoring & Stats
  "score:changed": ScoreChangedPayload;
  "lives:changed": LivesChangedPayload;
  "high_score:broken": HighScoreBrokenPayload;

  // Save State
  "save_state:captured": SaveStateCapturedPayload;
  "save_state:applied": SaveStateAppliedPayload;

  // Audio
  "sfx:play": SfxPlayPayload;
  "audio:unlocked": AudioUnlockedPayload;
}

// ═══════════════════════════════════════════════════════════════
// TYPE UTILITIES
// ═══════════════════════════════════════════════════════════════

export type EventKey = keyof GameEventMap;
export type EventCallback<K extends EventKey = EventKey> = (
  payload: GameEventMap[K]
) => void;