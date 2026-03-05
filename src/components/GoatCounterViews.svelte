<script lang="ts">
  import { onMount } from "svelte";
  import { GOATCOUNTER_SITE } from "../config";

  export let path: string | undefined = undefined;

  let count = "";

  onMount(() => {
    const base = `https://${GOATCOUNTER_SITE}.goatcounter.com/counter`;
    const endpoint = path
      ? `${base}/posts/${path}/.json`
      : `${base}/TOTAL.json`;
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => { count = data.count; })
      .catch(() => {});
  });
</script>

{#if count}
  <span class="text-base-500 text-xs">{path ? `조회 ${count}회` : `총 ${count}번 조회했어요.`}</span>
{/if}
