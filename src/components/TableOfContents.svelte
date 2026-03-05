<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    headings: { depth: number; slug: string; text: string }[];
  }

  const { headings }: Props = $props();

  const filtered = headings.filter((h) => h.depth >= 2 && h.depth <= 3);
  let activeSlug = $state("");
  let visible = $state(false);
  let indicatorY = $state(0);
  let indicatorH = $state(0);
  let listEl: HTMLUListElement | undefined = $state();
  let ignoreObserver = false;

  function updateIndicator() {
    if (!listEl || !activeSlug) return;
    const activeLink = listEl.querySelector(`[data-slug="${activeSlug}"]`) as HTMLElement | null;
    if (!activeLink) return;
    const listRect = listEl.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    indicatorY = linkRect.top - listRect.top;
    indicatorH = linkRect.height;
  }

  function handleClick(e: MouseEvent, slug: string) {
    e.preventDefault();
    activeSlug = slug;
    ignoreObserver = true;
    const target = document.getElementById(slug);
    if (target) {
      const y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setTimeout(() => { ignoreObserver = false; }, 800);
  }

  $effect(() => {
    activeSlug;
    updateIndicator();
  });

  onMount(() => {
    const elements = filtered
      .map((h) => document.getElementById(h.slug))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        if (ignoreObserver) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeSlug = entry.target.id;
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    for (const el of elements) {
      observer.observe(el);
    }

    const onScroll = () => {
      const footer = document.querySelector("footer");
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const tocBottom = 96 + (listEl?.offsetHeight ?? 0);
        visible = window.scrollY > 300 && footerTop > tocBottom + 200;
      } else {
        visible = window.scrollY > 300;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  });
</script>

<nav class={["transition-opacity duration-300", visible ? "opacity-100" : "opacity-0 pointer-events-none"]}>
  <div class="relative">
    <ul bind:this={listEl} class="relative flex flex-col gap-1.5 text-sm border-l border-base-300 dark:border-base-700">
      {#if activeSlug}
        <div
          class="absolute left-0 w-0.5 bg-accent-500 rounded-full -ml-px transition-all duration-300 ease-out"
          style="top: {indicatorY}px; height: {indicatorH}px;"
        ></div>
      {/if}
      {#each filtered as heading}
        <li>
          <a
            href={`#${heading.slug}`}
            data-slug={heading.slug}
            onclick={(e) => handleClick(e, heading.slug)}
            class={[
              "block transition-all duration-200 hover:text-accent-500",
              heading.depth === 3 ? "pl-6" : "pl-3",
              activeSlug === heading.slug
                ? "font-semibold text-white"
                : "text-base-500 dark:text-base-400"
            ]}
          >
            {heading.text}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</nav>
