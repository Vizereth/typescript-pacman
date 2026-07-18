<script lang="ts">
  import GameCard from "$shared/ui/GameCard.svelte";
  import { GameStatus, type GameStatusType } from "../shared/core/types.js";

  interface GameEntry {
    name: string;
    route: string;
    status: GameStatusType;
    description: string;
    frostType: "aurora" | "glacier" | "blizzard" | "boreal";
  }

  const games: GameEntry[] = [
    {
      name: "SNAKE",
      route: "/games/snake",
      status: GameStatus.AVAILABLE,
      description:
        "Бесконечная навигация в ледяном лабиринте. Избегайте фантомов и собирайте осколки.",
      frostType: "aurora",
    },
    {
      name: "TETRIS",
      route: "/games/tetris",
      status: GameStatus.IN_DEVELOPMENT,
      description:
        "Геометрический спуск. Кристаллизация падающих фрагментов в единую структуру.",
      frostType: "glacier",
    },
    {
      name: "SIMON",
      route: "/games/simon",
      status: GameStatus.IN_DEVELOPMENT,
      description:
        "Резонанс памяти. Повторите затихающие звуковые сигналы полярной станции.",
      frostType: "blizzard",
    },
    {
      name: "PAC-MAN",
      route: "/games/pacman",
      status: GameStatus.IN_DEVELOPMENT,
      description:
        "Космическая сингулярность. Поглощение светящейся материи в аномальной зоне.",
      frostType: "boreal",
    },
  ];

  interface Snowflake {
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
    drift: number;
  }

  function generateSnowflakes(count: number): Snowflake[] {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1.5 + Math.random() * 2.5,
      speed: 20 + Math.random() * 30,
      opacity: 0.1 + Math.random() * 0.25,
      drift: -15 + Math.random() * 30,
    }));
  }

  const snowflakes = generateSnowflakes(35);
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1.0 + Math.random() * 1.2,
    opacity: 0.2 + Math.random() * 0.4,
    delay: Math.random() * 5,
  }));
</script>

<div class="winter-noir">
  <div class="sky-canvas">
    <div class="aurora-glow"></div>

    <div class="stars">
      {#each stars as star (star.id)}
        <div
          class="star"
          style:left="{star.x}%"
          style:top="{star.y}%"
          style:width="{star.size}px"
          style:height="{star.size}px"
          style:opacity={star.opacity}
          style:animation-delay="{star.delay}s"
        ></div>
      {/each}
    </div>

    <div class="snowfall">
      {#each snowflakes as flake (flake.id)}
        <div
          class="snowflake"
          style:left="{flake.x}%"
          style:top="-5%"
          style:width="{flake.size}px"
          style:height="{flake.size}px"
          style:opacity={flake.opacity}
          style:--speed="{flake.speed}s"
          style:--drift="{flake.drift}px"
          style:animation-delay="-{Math.random() * 25}s"
        ></div>
      {/each}
    </div>
  </div>

  <main class="interface-layer">
    <header class="luxury-header">
      <div class="brand-monogram">✦ ARCHIVE SYSTEM ✦</div>
      <h1 class="main-title">
        <span class="light">NORTHERN</span>
        <span class="bold">ARCADE</span>
      </h1>
      <p class="subtitle">выберите активную проекцию для симуляции</p>
    </header>

    <div class="cards-viewport">
      {#each games as game (game.name)}
        <GameCard
          name={game.name}
          route={game.route}
          status={game.status}
          description={game.description}
          frostType={game.frostType}
        />
      {/each}
    </div>

    <footer class="minimal-footer">
      <span class="build-ver">SYS.NIGHT.v0.1.0</span>
      <div class="footer-line"></div>
      <span class="copyright">© 2026 TERMINAL</span>
    </footer>
  </main>
</div>

<style lang="scss">
  $bg-absolute: #030508;
  $bg-sky-top: #06090e;
  $bg-sky-bottom: #0a0f18;

  $text-pure: #ffffff;
  $text-silver: #f8fafc;
  $text-dark-ice: #94a3b8;
  $text-muted: #475569;

  $font-premium: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;

  :global(body) {
    background-color: $bg-absolute;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  .winter-noir {
    position: relative;
    min-height: 100vh;
    width: 100vw;
    font-family: $font-premium;
    color: $text-pure;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .sky-canvas {
    position: fixed;
    inset: 0;
    background: linear-gradient(to bottom, $bg-sky-top, $bg-sky-bottom);
    z-index: 1;
    pointer-events: none;

    .aurora-glow {
      position: absolute;
      top: 0;
      left: 20%;
      width: 60%;
      height: 50%;
      background: radial-gradient(
        ellipse at top,
        rgba(14, 116, 144, 0.15) 0%,
        rgba(15, 23, 42, 0) 80%
      );
      filter: blur(50px);
    }
  }

  .star {
    position: absolute;
    border-radius: 50%;
    background: #ffffff;
    animation: pulseStar 6s ease-in-out infinite alternate;
  }

  @keyframes pulseStar {
    0% {
      opacity: 0.2;
    }
    100% {
      opacity: 0.6;
    }
  }

  .snowfall {
    position: absolute;
    inset: 0;
  }

  .snowflake {
    position: absolute;
    background: #ffffff;
    border-radius: 50%;
    animation: linearFall var(--speed) linear infinite;
  }

  @keyframes linearFall {
    0% {
      transform: translateY(0) translateX(0);
    }
    100% {
      transform: translateY(105vh) translateX(var(--drift));
    }
  }

  .interface-layer {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 1200px;
    padding: 90px 40px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 70px;
  }

  .luxury-header {
    text-align: center;

    .brand-monogram {
      font-size: 11px;
      font-weight: 600;
      color: $text-dark-ice;
      letter-spacing: 4px;
      margin-bottom: 20px;
    }

    .main-title {
      margin: 0;
      font-size: 3rem;
      letter-spacing: 20px;
      text-indent: 20px;
      line-height: 1.1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .light {
        font-weight: 300;
        color: rgba($text-pure, 0.9);
      }
      .bold {
        font-weight: 800;
        margin-top: 6px;
        background: linear-gradient(to bottom, #ffffff, #cbd5e1);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .subtitle {
      margin: 28px 0 0 0;
      font-size: 0.8rem;
      font-weight: 500;
      letter-spacing: 5px;
      text-indent: 5px;
      color: $text-dark-ice;
      text-transform: uppercase;
    }
  }

  .cards-viewport {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 28px;
    width: 100%;
  }

  .minimal-footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.7rem;
    letter-spacing: 3px;
    color: $text-muted;
    margin-top: 20px;

    .footer-line {
      flex-grow: 1;
      height: 1px;
      background: rgba(255, 255, 255, 0.06);
      margin: 0 40px;
    }
  }

  @media (max-width: 1100px) {
    .cards-viewport {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .interface-layer {
      padding: 60px 24px;
      gap: 50px;
    }
    .main-title {
      font-size: 2rem;
    }
    .cards-viewport {
      grid-template-columns: 1fr;
      max-width: 340px;
    }
    .minimal-footer {
      flex-direction: column;
      gap: 16px;
      .footer-line {
        display: none;
      }
    }
  }
</style>
