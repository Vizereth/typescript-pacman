<!-- src/routes/pacman/+page.svelte -->
<script lang="ts">
  import GameShell from "../../../shared/ui/GameShell.svelte";
  import { PacmanGame } from "../../../games/pacman/core/GameMain.js";

  const game = new PacmanGame();
</script>

<GameShell game={game} gameName="PAC-MAN" />