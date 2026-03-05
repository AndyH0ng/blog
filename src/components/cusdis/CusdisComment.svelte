<script lang="ts">
  import type { CusdisComment } from "./types";
  import Avatar from "../bluesky/Avatar.svelte";
  import RelativeTime from "../bluesky/relative-time";
  import CusdisReplyForm from "./CusdisReplyForm.svelte";

  const {
    comment,
    depth = 0,
    appId,
    pageId,
    serverURL,
    onRefresh,
  }: {
    comment: CusdisComment;
    depth?: number;
    appId: string;
    pageId: string;
    serverURL: string;
    onRefresh: () => void;
  } = $props();

  let expanded = $state(true);
  let showReplyForm = $state(false);

  function getInitialAvatar(name: string): string {
    return name.charAt(0).toUpperCase();
  }
</script>

{#snippet top(expand: boolean)}
  <div
    class="text-sm text-base-600 dark:text-base-500 flex items-center -ml-6"
  >
    <div class="relative size-6">
      <Avatar size="size-6" />
      {#if expand}
        <button
          class="absolute inset-0 size-6 bg-black/50 text-white rounded-full flex items-center justify-center"
          onclick={() => (expanded = !expanded)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="size-3"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span class="sr-only">댓글 펼치기</span>
        </button>
      {/if}
    </div>
    <span class="ml-2 dark:text-base-400 font-medium">
      {comment.by_nickname}
    </span>

    <div class="text-xs ml-2 text-base-500">
      <RelativeTime date={new Date(comment.createdAt)} locale="ko" />
    </div>
  </div>
{/snippet}

<div class="pl-3 relative">
  <button
    class="group absolute -left-1.5 top-0 w-3 h-full flex items-center"
    onclick={() => (expanded = !expanded)}
  >
    <div
      class="mx-auto w-0.5 h-full bg-base-200 dark:bg-base-800 group-hover:bg-base-300 dark:group-hover:bg-base-700"
    ></div>
    <span class="sr-only">댓글 접기</span>
  </button>

  <div class="mt-2 pb-2">
    {#if expanded}
      {@render top(false)}
      <div class="mt-1 text-sm text-base-800 dark:text-base-200 whitespace-pre-wrap">
        {comment.content}
      </div>

      <div class="mt-2 flex gap-8 text-base-500 dark:text-base-400">
        <button
          onclick={() => (showReplyForm = !showReplyForm)}
          class="group inline-flex items-center gap-2 text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="-m-1.5 size-7 rounded-full p-1.5 transition-all duration-100 group-hover:bg-accent-500/10 group-hover:text-accent-700 dark:group-hover:text-accent-400"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
            />
          </svg>
          답글
        </button>
      </div>

      {#if showReplyForm}
        <div class="mt-2">
          <CusdisReplyForm
            {appId}
            {pageId}
            {serverURL}
            parentId={comment.id}
            onSubmit={() => {
              showReplyForm = false;
              onRefresh();
            }}
          />
        </div>
      {/if}

      {#if comment.replies?.data?.length > 0 && depth <= 4}
        {#each comment.replies.data as reply}
          <svelte:self
            comment={reply}
            depth={depth + 1}
            {appId}
            {pageId}
            {serverURL}
            {onRefresh}
          />
        {/each}
      {:else if comment.replies?.data?.length > 0 && depth > 4}
        <span
          class="text-sm text-base-500 dark:text-base-400 hover:dark:text-base-300 hover:text-base-600 font-medium"
        >
          답글 {comment.replies.commentCount}개 더 있음
        </span>
      {/if}
    {:else}
      <button onclick={() => (expanded = true)}>
        {@render top(true)}
      </button>
    {/if}
  </div>
</div>
