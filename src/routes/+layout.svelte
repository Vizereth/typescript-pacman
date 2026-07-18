<script lang="ts">
  import "../lib/scss/style.scss"; // Your global styles

  // 1. Accept the 'children' snippet as a prop (Svelte 5 standard)
  let { children } = $props();

</script>

{@render children()}