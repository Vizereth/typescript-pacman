// src/games/pacman/core/GameMain.ts
import { GlobalStateMachine } from "./GlobalStateMachine.js";
import { PixiApp } from "../../../shared/view/PixiApp.js";
import { GameLoop } from "./GameLoop.js";
import { AtomView } from "../view/entities/AtomView.js";
import { Atom } from "../logic/entities/Atom.js";
import { EventBus } from "./EventBus.js";
import type { GameModule, UIBridge } from "../../../shared/core/types.js";

export class PacmanGame implements GameModule {
  public readonly eventBus: EventBus;
  public readonly stateMachine: GlobalStateMachine;

  private pixiView!: PixiApp;
  private loop!: GameLoop;
  private atom!: Atom;
  private atomView!: AtomView;
  private ui!: UIBridge;

  constructor() {
    this.eventBus = new EventBus();
    this.stateMachine = new GlobalStateMachine(this.eventBus);
  }

  public async init(canvasParent: HTMLDivElement, ui: UIBridge): Promise<void> {
    this.ui = ui;
    console.log("[Pacman Init]: Booting core systems...");

    // Step 1: Initialize the rendering context
    this.pixiView = new PixiApp();
    await this.pixiView.init(canvasParent);

    // Step 2: Initialize the game loop
    this.loop = new GameLoop(this.pixiView.ticker);

    // Step 3: Initialize entities
    const centerX = this.pixiView.app.screen.width / 2;
    const centerY = this.pixiView.app.screen.height / 2;

    this.atom = new Atom(centerX, centerY);
    this.atomView = new AtomView();

    // Step 4: Mount view to stage
    this.pixiView.stage.addChild(this.atomView.container);

    // Step 5: Start the loop
    this.loop.start((deltaMS) => {
      this.atom.update(deltaMS);
      this.atomView.sync(this.atom);
    });

    // Step 6: Transition state machine
    await this.stateMachine.transitionTo("READY");
    await this.stateMachine.transitionTo("PLAYING");

    // Notify UI
    this.ui.onStateChange("PLAYING");
    this.ui.onScoreUpdate(0);
    this.ui.onLivesUpdate(3);

    console.log("[Pacman Init]: All systems operational.");
  }

  public destroy(): void {
    this.loop.destroy();
    this.pixiView.destroy();
  }
}