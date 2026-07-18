// src/ui/context/UILevelState.ts

/**
 * Encapsulates the visual presentation metrics for the Svelte HUD overlay.
 * This class is entirely unaware of physics rules, AI steering, or entity configurations.
 */
export class UILevelState {
  public score = $state({ current: 0 });
  public lives = $state({ current: 3 });
  public level = $state({ current: 1 });
  public isParadigmShift = $state({ current: false });

  public addScore(points: number): void {
    this.score.current += points;
  }

  public decrementLife(): void {
    this.lives.current = Math.max(0, this.lives.current - 1);
  }

  public setLevel(nextLevel: number, mode: "STANDARD" | "MS_PACMAN"): void {
    this.level.current = nextLevel;
    this.isParadigmShift.current = mode === "MS_PACMAN";
  }
}
