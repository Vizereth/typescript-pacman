<script lang="ts">
  import { onMount } from "svelte";

  let transitioning = $state(false);
  let mouseX = $state(0);
  let mouseY = $state(0);

  function goHome(e: MouseEvent) {
    e.preventDefault();
    if (transitioning) return;

    transitioning = true;

    // Эффект сжатия экрана перед уходом на главную
    setTimeout(() => {
      window.location.href = "/";
    }, 600);
  }

  function handleMouseMove(e: MouseEvent) {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  }
</script>

<main
  class="obs-404"
  class:obs-404--exit={transitioning}
  onmousemove={handleMouseMove}
  style="--mx: {mouseX}; --my: {mouseY};"
>
  <div class="obs-404__sky"></div>

  <div class="obs-404__content error">
    <span class="error__code">404</span>

    <div class="error__separator">
      <span class="error__line error__line--left"></span>
      <span class="error__mark">◈</span>
      <span class="error__line error__line--right"></span>
    </div>

    <h1 class="error__title">Signal Lost</h1>
    <p class="error__description">
      The coordinates you requested point to an uncharted sector. The telemetry
      archive contains no data on this orbit.
    </p>
  </div>

  <nav class="obs-404__nav list">
    <button class="list__item action" style="--c: #aa4444" onclick={goHome}>
      <span class="action__id">RE</span>
      <span class="action__star"></span>
      <span class="action__name">Return to Observatory</span>
      <span class="action__line"></span>
    </button>
  </nav>

  <footer class="obs-404__footer foot">
    <span class="foot__star"></span>
    <span class="foot__text">deep space anomaly detected</span>
  </footer>
</main>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Orbitron:wght@500;700&family=Syncopate:wght@500;700&family=Montserrat:wght@300;400;500;600&display=swap");

  :global(body) {
    margin: 0;
    background: #010106;
    font-family: "Montserrat", sans-serif;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
  }

  .obs-404 {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    gap: 4.5rem;
    position: relative;
    z-index: 2;
    transition:
      opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1),
      transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);

    &--exit {
      opacity: 0;
      transform: scaleY(0.05);
      pointer-events: none;
    }

    &__sky {
      position: fixed;
      inset: -20px;
      z-index: -1;
      pointer-events: none;
      transform: translate(calc(var(--mx) * -30px), calc(var(--my) * -30px));
      transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);

      background:
        radial-gradient(1px 1px at 20% 30%, #fff, transparent),
        radial-gradient(
          1.5px 1.5px at 50% 70%,
          rgba(255, 150, 150, 0.4),
          transparent
        ),
        // Слегка красноватая туманность для 404
        radial-gradient(
            2px 2px at 80% 25%,
            rgba(255, 255, 255, 0.8),
            transparent
          ),
        radial-gradient(
          1px 1px at 10% 85%,
          rgba(140, 140, 255, 0.3),
          transparent
        ),
        radial-gradient(
          ellipse at center,
          rgba(16, 8, 8, 0.6) 0%,
          #010106 100%
        );
    }
  }

  // Блок текста ошибки
  .error {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 500px;

    &__code {
      font-family: "Orbitron", sans-serif;
      font-size: 5rem;
      font-weight: 700;
      letter-spacing: 6px;
      color: rgba(170, 68, 68, 0.15); // Приглушенный красный оттенок
      text-shadow: 0 0 30px rgba(170, 68, 68, 0.05);
      line-height: 1;
      margin-bottom: 0.5rem;
    }

    &__separator {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      width: 100%;
      margin-bottom: 1.5rem;
    }

    &__line {
      height: 1px;
      flex: 1;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(170, 68, 68, 0.3),
        transparent
      );
    }

    &__mark {
      font-size: 1.2rem;
      color: rgba(170, 68, 68, 0.4);
      text-shadow: 0 0 10px rgba(170, 68, 68, 0.3);
    }

    &__title {
      font-family: "Cinzel Decorative", serif;
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: 12px;
      text-transform: uppercase;
      color: rgba(235, 230, 255, 0.9);
      margin: 0 0 1.2rem 0;
      text-indent: 12px;
    }

    &__description {
      font-size: 0.85rem;
      font-weight: 400;
      line-height: 1.8;
      letter-spacing: 1px;
      color: rgba(140, 135, 155, 0.6);
      margin: 0;
    }
  }

  .list {
    width: 100%;
    max-width: 460px;
  }

  // Стилизация кнопки действия
  .action {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 0.9rem 1.5rem;
    background: transparent;
    border: none;
    box-shadow: none;
    outline: none;
    position: relative;
    text-align: left;
    width: 100%;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    transition: transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);

    &__id {
      font-family: "Orbitron", sans-serif;
      font-size: 0.7rem;
      font-weight: 500;
      color: rgba(170, 68, 68, 0.4);
      letter-spacing: 1px;
      min-width: 24px;
      transition: color 0.3s ease;
    }

    &__star {
      width: 4px;
      height: 4px;
      background: rgba(170, 68, 68, 0.4);
      border-radius: 50%;
      transition:
        transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1),
        background 0.3s ease,
        box-shadow 0.3s ease;
    }

    &__name {
      font-family: "Syncopate", sans-serif;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 3px;
      color: rgba(140, 130, 140, 0.45);
      text-transform: uppercase;
      transition:
        color 0.35s ease,
        text-shadow 0.35s ease;
    }

    &__line {
      position: absolute;
      bottom: 0;
      left: 50%;
      right: 50%;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--c) 50%,
        transparent
      );
      opacity: 0;
      transition:
        left 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
        right 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
        opacity 0.3s ease;
    }

    // Твой спокойный ховер на строку
    &:hover {
      transform: translateX(8px);

      .action__id {
        color: rgba(255, 200, 200, 0.8);
      }

      .action__name {
        color: #ffffff;
        text-shadow:
          0 0 10px var(--c),
          0 0 20px rgba(255, 255, 255, 0.15);
      }

      .action__star {
        background: var(--c);
        transform: scale(1.4);
        box-shadow:
          0 0 8px var(--c),
          0 0 15px var(--c);
      }

      .action__line {
        left: 0%;
        right: 0%;
        opacity: 0.5;
      }
    }
  }

  .foot {
    font-size: 0.65rem;
    letter-spacing: 4px;
    color: rgba(150, 130, 130, 0.4);
    display: flex;
    align-items: center;
    gap: 0.7rem;
    text-transform: uppercase;

    &__star {
      width: 3px;
      height: 3px;
      background: rgba(170, 68, 68, 0.4);
      border-radius: 50%;
      box-shadow: 0 0 4px rgba(170, 68, 68, 0.3);
    }
  }
</style>
