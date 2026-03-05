<script>
  import { onMount } from "svelte";
  import { GISCUS_REPO, GISCUS_REPO_ID, GISCUS_CATEGORY, GISCUS_CATEGORY_ID } from "../config";

  let container = $state(null);

  function getTheme() {
    const isDark = document.documentElement.classList.contains("dark");
    const isSecure = window.location.protocol === "https:";
    if (isSecure) {
      const origin = window.location.origin;
      return isDark ? `${origin}/giscus-dark.css` : `${origin}/giscus-light.css`;
    }
    return isDark ? "dark" : "light";
  }

  onMount(() => {
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", GISCUS_REPO);
    script.setAttribute("data-repo-id", GISCUS_REPO_ID);
    script.setAttribute("data-category", GISCUS_CATEGORY);
    script.setAttribute("data-category-id", GISCUS_CATEGORY_ID);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", getTheme());
    script.setAttribute("data-lang", "ko");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;
    container?.appendChild(script);

    const observer = new MutationObserver(() => {
      const iframe = document.querySelector("iframe.giscus-frame");
      if (iframe) {
        iframe.contentWindow?.postMessage(
          { giscus: { setConfig: { theme: getTheme() } } },
          "https://giscus.app"
        );
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  });
</script>

<div class="not-prose mt-8" bind:this={container}></div>
