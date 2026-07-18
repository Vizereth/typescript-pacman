<script lang="ts">
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";
  import { GameState, type GameStateType } from "../core/types.js";
  import type { GameModule, UIBridge } from "../core/types.js";
  import Spinner from "./Spinner.svelte";

  interface Props {
    game: GameModule;
    gameName: string;
    startOverlay?: Snippet<[]>;
    gameOverOverlay?: Snippet<[{ score: number }]>;
    pauseOverlay?: Snippet<[]>;
    hud?: Snippet<[{ score: number; lives: number; state: GameStateType }]>;
  }

  let {
    game,
    gameName,
    startOverlay,
    gameOverOverlay,
    pauseOverlay,
    hud,
  }: Props = $props();

  interface Snowflake {
    id: number;
    left: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
    drift: number;
  }

  function generateSnowflakes(count: number): Snowflake[] {
    const flakes: Snowflake[] = [];
    for (let i = 0; i < count; i++) {
      const seed = i * 137.508;
      flakes.push({
        id: i,
        left: seed % 100,
        size: 2 + (i % 4),
        duration: 12 + (i % 8) * 2,
        delay: (i % 12) * 0.8,
        opacity: 0.2 + (i % 6) * 0.1,
        drift: -20 + (i % 40),
      });
    }
    return flakes;
  }

  const snowflakes: Snowflake[] = generateSnowflakes(30);
  const decoLayers: number[] = [0, 1, 2];

  let isBooting: boolean = $state(true);
  let canvasParent: HTMLDivElement;

  let score: number = $state(0);
  let lives: number = $state(0);
  let gameState: GameStateType = $state(GameState.BOOTING);

  const ui: UIBridge = {
    onScoreUpdate: (s: number): void => { score = s; },
    onLivesUpdate: (l: number): void => { lives = l; },
    onStateChange: (st: GameStateType): void => { gameState = st; },
    onMessage: (_m: string): void => { /* reserved */ },
  };

  onMount(() => {
    const boot = async (): Promise<void> => {
      await game.init(canvasParent, ui);
      isBooting = false;
    };
    boot();

    return (): void => { game.destroy(); };
  });

  function isStartState(state: GameStateType): boolean {
    if (state === GameState.MENU) return true;
    if (state === GameState.READY) return true;
    return false;
  }

  function isGameOverState(state: GameStateType): boolean {
    if (state === GameState.GAME_OVER) return true;
    return false;
  }

  function isPausedState(state: GameStateType): boolean {
    if (state === GameState.PAUSED) return true;
    return false;
  }

  const showStartOverlay: boolean = $derived(isStartState(gameState));
  const showGameOverOverlay: boolean = $derived(isGameOverState(gameState));
  const showPauseOverlay: boolean = $derived(isPausedState(gameState));
</script>

<div class="winter-expanse">
  <div class="snowfall">
    {#each snowflakes as flake (flake.id)}
      <div
        class="snowflake"
        style="
          left: {flake.left}%;
          width: {flake.size}px;
          height: {flake.size}px;
          animation-duration: {flake.duration}s;
          animation-delay: {flake.delay}s;
          --flake-opacity: {flake.opacity};
          --drift: {flake.drift}px;
        "
      ></div>
    {/each}
  </div>

  <div class="cabinet-scaler-box">
    <div class="fracture-well">
      {#each decoLayers as i}
        <div
          class="fracture-frame"
          style="
            --offset-w: {40 + i * 36}px;
            --offset-h: {40 + i * 36}px;
            --delay: {i * 1.5}s;
          "
        ></div>
      {/each}

      <div class="viewport">
        <div class="game-layer">
          {#if isBooting}
            <div class="boot-overlay">
              <Spinner />
            </div>
          {/if}

          <div
            bind:this={canvasParent}
            class="canvas-mount"
            class:hidden={isBooting}
          ></div>

          {#if showStartOverlay}
            <div class="overlay-layer">
              {#if startOverlay}
                {@render startOverlay()}
              {:else}
                <div class="default-overlay">
                  <h2 class="overlay-title">{gameName}</h2>
                  <p class="overlay-hint">PRESS START</p>
                </div>
              {/if}
            </div>
          {/if}

          {#if showGameOverOverlay}
            <div class="overlay-layer">
              {#if gameOverOverlay}
                {@render gameOverOverlay({ score })}
              {:else}
                <div class="default-overlay">
                  <h2 class="overlay-title">GAME OVER</h2>
                  <p class="overlay-score">SCORE: {score.toLocaleString()}</p>
                </div>
              {/if}
            </div>
          {/if}

          {#if showPauseOverlay}
            <div class="overlay-layer">
              {#if pauseOverlay}
                {@render pauseOverlay()}
              {:else}
                <div class="default-overlay">
                  <h2 class="overlay-title">PAUSED</h2>
                </div>
              {/if}
            </div>
          {/if}
        </div>

        <div class="hud-bar">
          {#if hud}
            {@render hud({ score, lives, state: gameState })}
          {:else}
            <div class="default-hud">
              <span class="hud-item">SCORE: {score.toLocaleString()}</span>
              {#if lives > 0}
                <span class="hud-item">LIVES ×{lives}</span>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @mixin respond-to($max-width) {
    @media (max-width: #{$max-width}) {
      @content;
    }
  }

  $frost-void: #080c18;
  $frost-deep: #0a1020;
  $frost-accent: #6ba3d6;
  $frost-accent-light: #a8d8ea;
  $frost-text: #e0ecf8;
  $frost-text-dim: #8ba4c0;
  $frost-border: rgba(107, 163, 214, 0.15);

  :root {
    --cabinet-scale: 1;
  }
  @include respond-to(1920px) { :root { --cabinet-scale: 0.85; } }
  @include respond-to(1440px) { :root { --cabinet-scale: 0.72; } }
  @include respond-to(1024px) { :root { --cabinet-scale: 0.55; } }
  @include respond-to(480px) { :root { --cabinet-scale: 0.42; } }

  :global(body) {
    margin: 0;
    background: $frost-void;
    overflow: hidden;
  }

  .winter-expanse {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100vw;
    background: radial-gradient(ellipse at 50% 30%, #111830 0%, $frost-deep 40%, $frost-void 70%);
    font-family: "Jersey-Regular", "Courier New", monospace;
    position: relative;
    overflow: hidden;
  }

  .snowfall {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }

  .snowflake {
    position: absolute;
    top: -10px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(168, 216, 234, 0.3) 100%);
    border-radius: 50%;
    animation: snowfall linear infinite;
    filter: blur(0.3px);
  }

  @keyframes snowfall {
    0% {
      transform: translateY(0) translateX(0);
      opacity: var(--flake-opacity, 0.6);
    }
    100% {
      transform: translateY(110vh) translateX(var(--drift, 15px));
      opacity: 0;
    }
  }

  .cabinet-scaler-box {
    display: inline-block;
    position: relative;
    transform: scale(var(--cabinet-scale));
    transform-origin: center center;
    transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    z-index: 1;
  }

  .fracture-well {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .fracture-frame {
    position: absolute;
    top: calc(var(--offset-h) / -2);
    left: calc(var(--offset-w) / -2);
    width: calc(100% + var(--offset-w));
    height: calc(100% + var(--offset-h));
    border: 1px solid $frost-border;
    pointer-events: none;
    box-sizing: border-box;
    animation: frost-wave 8s ease-in-out infinite;
    animation-delay: var(--delay);
    transition:
      top 0.3s ease-out,
      left 0.3s ease-out,
      width 0.3s ease-out,
      height 0.3s ease-out;
  }

  .viewport {
    position: relative;
    display: flex;
    flex-direction: column;
    z-index: 2;
    background: #000000;
    border: 1px solid $frost-border;
    transition: width 0.3s ease-out, height 0.3s ease-out;

    :global(*) {
      box-sizing: border-box;
    }
  }

  .game-layer {
    position: relative;
    display: block;
    width: 100%;
    height: auto;
  }

  .boot-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba($frost-void, 0.95);
    z-index: 100;
  }

  .canvas-mount {
    display: block;
    transition: opacity 0.4s ease;
    opacity: 1;

    :global(canvas) {
      display: block;
      image-rendering: pixelated;
    }
  }

  .canvas-mount.hidden {
    opacity: 0;
  }

  .overlay-layer {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba($frost-void, 0.88);
    z-index: 50;
    pointer-events: auto;
  }

  .default-overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .overlay-title {
    margin: 0;
    font-size: 2.4rem;
    letter-spacing: 8px;
    background: linear-gradient(180deg, #ffffff 0%, $frost-accent-light 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 20px rgba($frost-accent, 0.5));
  }

  .overlay-hint {
    margin: 0;
    font-size: 1.1rem;
    letter-spacing: 5px;
    color: $frost-text-dim;
    animation: breathe 2s ease-in-out infinite;
  }

  .overlay-score {
    margin: 0;
    font-size: 1.8rem;
    letter-spacing: 4px;
    color: $frost-text;
    text-shadow: 0 0 15px rgba($frost-accent, 0.4);
  }

  @keyframes breathe {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.85; }
  }

  .hud-bar {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 14px;
    background: rgba($frost-void, 0.9);
    border-top: 1px solid $frost-border;
    color: $frost-text-dim;
    box-sizing: border-box;
  }

  .default-hud {
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 1.2rem;
    letter-spacing: 2px;
  }

  .hud-item {
    color: rgba($frost-text, 0.8);
  }

  @keyframes frost-wave {
    0%, 100% { border-color: rgba(107, 163, 214, 0.06); }
    50% { border-color: rgba(107, 163, 214, 0.2); }
  }
</style>