<script lang="ts">
  // List of routes with labels
  const routes = [{ path: "/pacman", name: "Play Pac-Man" }];
</script>

<main class="home">
  <ul>
    {#each routes as route}
      <li><a href={route.path}>{route.name}</a></li>
    {/each}
  </ul>
</main>

<style lang="scss">
  .home {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
</style>
