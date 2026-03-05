<script lang="ts">
  import { onMount } from "svelte";
  import { GOATCOUNTER_SITE } from "../config";

  export let path: string | undefined = undefined;

  let count = "";

  onMount(async () => {
    try {
      const base = `https://${GOATCOUNTER_SITE}.goatcounter.com/counter`;
      const endpoint = path
        ? `${base}/posts/${path}/.json`
        : `${base}/TOTAL.json`;
      const res = await fetch(endpoint);
      const data = await res.json();
      count = data.count;
    } catch (e) {
      console.error("GoatCounter fetch error:", e);
    }
  });
</script>

{#if count}
  <span class="text-base-500 text-xs">조회 {count}회</span>
{/if}
