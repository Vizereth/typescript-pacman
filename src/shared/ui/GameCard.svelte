<script lang="ts">
  import { GameStatus, type GameStatusType } from "../core/types.js";

  interface Props {
    name: string;
    route: string;
    status: GameStatusType;
    description: string;
    frostType: "aurora" | "glacier" | "blizzard" | "boreal";
  }

  let { name, route, status, description, frostType }: Props = $props();

  const isAvailable: boolean = $derived(status === GameStatus.AVAILABLE);
</script>

{#if isAvailable}
  <a
    href={route}
    class="noir-card available {frostType}"
  >
    <div class="frost-overlay"></div>
    <div class="card-inner">
      <div class="card-header-zone">
        <!-- Яркий осязаемый бейдж вместо блеклых букв -->
        <span class="status-badge active">
          <span class="dot"></span> ДОСТУПНО
        </span>
      </div>
      
      <div class="card-content-zone">
        <h2 class="card-name">{name}</h2>
        <p class="card-desc">{description}</p>
      </div>

      <div class="card-footer-zone">
        <span class="action-text">ЗАПУСТИТЬ ТЕРМИНАЛ</span>
        <span class="action-glyph">➔</span>
      </div>
    </div>
  </a>
{:else}
  <div class="noir-card locked">
    <div class="card-inner">
      <div class="card-header-zone">
        <span class="status-badge disabled">БЛОКИРОВАНО</span>
      </div>
      
      <div class="card-content-zone">
        <h2 class="card-name">{name}</h2>
        <p class="card-desc">Контур находится в режиме ожидания. Развертывание кода не завершено.</p>
      </div>

      <div class="card-footer-zone">
        <span class="lock-text">В РАЗРАБОТКЕ</span>
        <span class="lock-glyph">🔒</span>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  $text-pure: #ffffff;
  $text-bright: #f8fafc;
  $text-silver: #cbd5e1;
  $text-dark-ice: #64748b;
  
  // Делаем бэкграунд плотнее (0.85 вместо 0.4), чтобы текст гарантированно читался
  $card-bg: rgba(9, 13, 22, 0.85); 
  $card-border: rgba(255, 255, 255, 0.08);

  .noir-card {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 4 / 5;
    background: $card-bg;
    border: 1px solid $card-border;
    border-radius: 4px; // Строгий инженерный радиус
    text-decoration: none;
    color: inherit;
    overflow: hidden;
    box-sizing: border-box;
    transition: border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
    
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    .frost-overlay {
      position: absolute;
      inset: 0;
      opacity: 0.15; // Даем легкое свечение по умолчанию, чтобы оживить карту
      transition: opacity 0.4s ease, filter 0.4s ease;
      pointer-events: none;
      z-index: 1;
    }

    &.aurora .frost-overlay {
      background: radial-gradient(circle at 50% 100%, rgba(20, 184, 166, 0.2) 0%, transparent 80%);
    }
    &.glacier .frost-overlay {
      background: radial-gradient(circle at 50% 100%, rgba(14, 165, 233, 0.2) 0%, transparent 80%);
    }
    &.blizzard .frost-overlay {
      background: radial-gradient(circle at 50% 100%, rgba(148, 163, 184, 0.2) 0%, transparent 80%);
    }
    &.boreal .frost-overlay {
      background: radial-gradient(circle at 50% 100%, rgba(99, 102, 241, 0.2) 0%, transparent 80%);
    }

    &.available {
      cursor: pointer;

      &:hover {
        border-color: rgba(255, 255, 255, 0.3);
        background-color: rgba(13, 19, 32, 0.95);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);

        .frost-overlay {
          opacity: 0.4; // Усиливаем при ховере
        }

        .card-name {
          color: $text-pure;
        }

        .action-text {
          color: $text-pure;
          opacity: 1;
        }

        .action-glyph {
          transform: translateX(4px);
          opacity: 1;
        }
      }

      &:active {
        background-color: #030508;
      }
    }

    &.locked {
      opacity: 0.4;
      background: rgba(6, 9, 15, 0.9);
      border-color: rgba(255, 255, 255, 0.03);
    }
  }

  .card-inner {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 28px;
    box-sizing: border-box;
  }

  .card-header-zone {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;
  }

  // Полноценные читаемые бейджи
  .status-badge {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    padding: 4px 10px;
    border-radius: 2px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    
    &.active {
      background: rgba(20, 184, 166, 0.15);
      color: #2dd4bf;
      border: 1px solid rgba(20, 184, 166, 0.3);

      .dot {
        width: 5px;
        height: 5px;
        background-color: #2dd4bf;
        border-radius: 50%;
        box-shadow: 0 0 8px #2dd4bf;
      }
    }
    
    &.disabled {
      background: rgba(71, 85, 105, 0.2);
      color: #94a3b8;
      border: 1px solid rgba(71, 85, 105, 0.3);
    }
  }

  .card-content-zone {
    margin-top: auto; // Прижимает контент вниз, формируя правильную иерархию
    margin-bottom: 24px;
  }

  .card-name {
    margin: 0 0 12px 0;
    font-size: 1.75rem; // Крупнее и увереннее
    font-weight: 700;   // Сделали жирным, чтобы текст «читался» мгновенно
    letter-spacing: 3px;
    color: $text-bright;
    text-transform: uppercase;
  }

  .card-desc {
    margin: 0;
    font-size: 0.85rem; // Увеличили с 0.75
    font-weight: 400;
    line-height: 1.5;
    color: $text-silver; // Заменили прозрачный цвет на чистый контрастный slate
  }

  .card-footer-zone {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 16px;
    margin-top: inherit;
  }

  .action-text {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 1.5px;
    color: $text-dark-ice;
    opacity: 0.7;
    transition: all 0.2s ease;
  }

  .action-glyph {
    font-size: 0.85rem;
    color: $text-dark-ice;
    opacity: 0.6;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .lock-text {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 1.5px;
    color: rgba($text-dark-ice, 0.6);
  }

  .lock-glyph {
    font-size: 0.8rem;
    opacity: 0.4;
  }

  @media (max-width: 768px) {
    .card-inner { padding: 22px; }
    .card-name { font-size: 1.5rem; }
    .card-desc { font-size: 0.8rem; }
  }
</style>