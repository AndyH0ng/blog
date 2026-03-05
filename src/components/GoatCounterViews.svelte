<script lang="ts">
  import { onMount } from "svelte";
  import { GOATCOUNTER_SITE } from "../config";

  let count = "";

  onMount(() => {
    fetch(`https://${GOATCOUNTER_SITE}.goatcounter.com/counter/TOTAL.json`)
      .then((res) => res.json())
      .then((data) => { count = data.count; })
      .catch(() => {});
  });
</script>

{#if count}
  <span class="text-base-500 text-xs">총 {count}번 조회했어요.</span>
{/if}
