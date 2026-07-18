<script lang="ts">
  interface Props {
    message?: string;
    size?: number;
  }

  let { message = "INITIALIZING", size = 60 }: Props = $props();
</script>

<div class="spinner-container" style:--size="{size}px">
  <div class="spinner-ring outer"></div>
  <div class="spinner-ring inner"></div>
  <div class="spinner-core"></div>
  {#if message}
    <span class="spinner-message">{message}</span>
  {/if}
</div>

<style lang="scss">
  $frost-accent: #6ba3d6;
  $frost-accent-light: #a8d8ea;
  $frost-glow: rgba(107, 163, 214, 0.5);
  $frost-text: #e0ecf8;

  .spinner-container {
    position: relative;
    width: var(--size);
    height: var(--size);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 16px;
  }

  .spinner-ring {
    position: absolute;
    border-radius: 50%;
    border: 2px solid transparent;
  }

  .spinner-ring.outer {
    width: 100%;
    height: 100%;
    border-top-color: $frost-accent-light;
    border-right-color: rgba($frost-accent, 0.3);
    animation: spin 1.2s linear infinite;
    box-shadow: 0 0 20px $frost-glow;
  }

  .spinner-ring.inner {
    width: 65%;
    height: 65%;
    border-bottom-color: rgba($frost-text, 0.6);
    border-left-color: rgba($frost-text, 0.15);
    animation: spin 0.8s linear infinite reverse;
  }

  .spinner-core {
    width: 20%;
    height: 20%;
    border-radius: 50%;
    background: radial-gradient(circle, $frost-accent-light 0%, transparent 70%);
    animation: pulse 1.5s ease-in-out infinite;
  }

  .spinner-message {
    position: absolute;
    top: calc(100% + 12px);
    color: rgba($frost-accent, 0.7);
    font-size: 0.75rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    white-space: nowrap;
    animation: breathe 2s ease-in-out infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.4;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  @keyframes breathe {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.9; }
  }
</style>