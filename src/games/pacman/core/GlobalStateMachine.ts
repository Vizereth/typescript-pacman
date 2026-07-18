import type { EventBus } from "./EventBus.js";

export type GameState =
  | "BOOTING" | "READY" | "INTRO_SEQUENCE" | "PLAYING" 
  | "EVENT_HORIZON" | "DEATH_WAVE" | "LEVEL_TRANSITION" | "GAME_OVER";

export interface StateLifecycleHooks {
  onEnter?: () => Promise<void> | void;
  onExit?: () => Promise<void> | void;
}

export class GlobalStateMachine {
  private currentState: GameState = "BOOTING";
  private registry: Map<GameState, StateLifecycleHooks> = new Map();
  private isTransitioning = false;

  // Инъекция зависимости: никаких импортов синглтонов
  constructor(private readonly eventBus: EventBus) {
    this.setupStateRegistry();
  }

  private setupStateRegistry(): void {
    const states: GameState[] = ["BOOTING", "READY", "INTRO_SEQUENCE", "PLAYING", "EVENT_HORIZON", "DEATH_WAVE", "LEVEL_TRANSITION", "GAME_OVER"];
    states.forEach(state => this.registerState(state, {}));
  }

  public registerState(state: GameState, hooks: StateLifecycleHooks): void {
    this.registry.set(state, hooks);
  }

  public getCurrentState(): GameState { return this.currentState; }

  public async transitionTo(nextState: GameState): Promise<void> {
    if (this.currentState === nextState || this.isTransitioning) return;

    this.isTransitioning = true;
    const previousState = this.currentState;

    const activeHooks = this.registry.get(previousState);
    if (activeHooks?.onExit) await activeHooks.onExit();

    this.currentState = nextState;

    // Используем инжектированный EventBus
    this.eventBus.emit("lifecycle:state_changed", { previous: previousState, current: nextState });

    const newHooks = this.registry.get(nextState);
    if (newHooks?.onEnter) await newHooks.onEnter();

    this.isTransitioning = false;
    console.log(`[Director]: State Transition Verified: ${previousState} ──> ${nextState}`);
  }
}