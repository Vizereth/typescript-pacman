<script lang="ts">
  // List of routes with labels
  const routes = [{ path: "/pacman", name: "Pac-Man" }];
</script>

<main class="home">
  <ul class="home__list bitcount-single-ink-500">
    {#each routes as route}
      <li class="home__list-item">
        <a class="home__list-link" href={route.path}>{route.name}</a>
      </li>
    {/each}
  </ul>
</main>

<style lang="scss">
  .home {
    display: flex;
    align-items: center;
    justify-content: center;

    &__list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    &__list-item {
      font-size: 2rem;
      text-transform: uppercase;
      transition: 0.15s ease-in;

      &:hover {
        transform: scale(1.05);
      }
    }
  }
</style>
