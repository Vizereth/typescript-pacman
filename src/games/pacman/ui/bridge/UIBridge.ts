import { EventBus } from "../../core/EventBus.js";
import type { UILevelState } from "../context/UILevelState.js";

export class UIBridge {
  private uiState: UILevelState;

  constructor(uiStateRef: UILevelState) {
    this.uiState = uiStateRef;
    this.bindEngineEvents();
  }

  /**
   * Registers EventBus listeners at the edge of the UI layer.
   * Maps incoming simulation payloads onto the local reactive UI context.
   */
  private bindEngineEvents(): void {
    EventBus.on("collectible:gathered", (payload) => {
      this.uiState.addScore(payload.points);
    });

    EventBus.on("engine:level_shifted", (payload) => {
      this.uiState.setLevel(payload.level, payload.ruleset);
    });

    // EventBus.on("player:died", () => {
    //   this.uiState.decrementLife();
    // });
  }
}
