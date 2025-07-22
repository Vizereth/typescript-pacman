<script lang="ts">
  import { onMount } from "svelte";
  import { Loop } from "../../pacman/game/loop.js";
  import { Controller } from "../../pacman/controller/controller.js";
  import { GameState } from "../../pacman/game/state.js";

  onMount(() => {
    const game = GameState.getInstance();
    game.startGame();

    const controller = new Controller();
    controller.init();

    const loopInstance = new Loop();
    loopInstance.start();
  });
</script>

<main>
  <div class="pacman">
    <canvas id="map-cvs"></canvas>
    <canvas id="food-cvs"></canvas>
    <canvas id="pill-cvs"></canvas>
    <canvas id="pacman-cvs"></canvas>
    <canvas id="ghosts-cvs"></canvas>
    <canvas id="ui-cvs"></canvas>
  </div>
</main>

<style lang="scss">
  main {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .pacman {
    flex: 1;
    position: relative;

    canvas {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
