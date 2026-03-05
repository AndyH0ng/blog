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

  const hasReplies = $derived(
    comment.replies?.data?.length > 0 && depth <= 4,
  );
  const showThread = $derived(expanded && (hasReplies || showReplyForm));
</script>

<div>
  <!-- Comment row -->
  <div class="flex gap-3 pt-4">
    <!-- Left: avatar + thread line stub -->
    <div class="flex flex-col items-center shrink-0">
      <button
        class="relative"
        onclick={() => (expanded = !expanded)}
        aria-label={expanded ? "댓글 접기" : "댓글 펼치기"}
      >
        <Avatar size="size-9" />
        {#if !expanded}
          <div
            class="absolute inset-0 size-9 bg-black/40 rounded-full flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="white"
              class="size-3.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
        {/if}
      </button>
      <!-- Thread line from below avatar to bottom of content row -->
      {#if showThread}
        <button
          class="group w-5 flex-1 flex justify-center mt-1"
          onclick={() => (expanded = !expanded)}
          aria-label="댓글 접기"
        >
          <div
            class="w-0.5 h-full bg-base-200 dark:bg-base-800 group-hover:bg-accent-400 dark:group-hover:bg-accent-600 transition-colors"
          ></div>
        </button>
      {/if}
    </div>

    <!-- Right: content -->
    <div class="flex-1 min-w-0 pb-1">
      <!-- Header -->
      <div class="flex items-baseline gap-2">
        <button
          class="font-semibold text-base-900 dark:text-base-100 hover:underline"
          onclick={() => (expanded = !expanded)}
        >
          {comment.by_nickname}
        </button>
        <span class="text-sm text-base-400 dark:text-base-500">&middot;</span>
        <span class="text-sm text-base-400 dark:text-base-500">
          <RelativeTime date={new Date(comment.createdAt)} locale="ko" />
        </span>
      </div>

      {#if expanded}
        <!-- Body -->
        <div
          class="mt-1.5 text-base text-base-800 dark:text-base-200 whitespace-pre-wrap leading-relaxed"
        >
          {comment.content}
        </div>

        <!-- Actions -->
        <div class="mt-2">
          <button
            onclick={() => (showReplyForm = !showReplyForm)}
            class="group inline-flex items-center gap-1.5 text-sm text-base-400 dark:text-base-500 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-4"
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

        <!-- Reply form -->
        {#if showReplyForm}
          <div class="mt-3">
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
      {:else}
        <!-- Collapsed preview -->
        <p class="text-sm text-base-400 dark:text-base-500 truncate mt-0.5">
          {comment.content}
        </p>
      {/if}
    </div>
  </div>

  <!-- Nested replies with curved connectors -->
  {#if expanded && hasReplies}
    {#each comment.replies.data as reply, i}
      {@const isLast = i === comment.replies.data.length - 1}
      <div class="relative" style="padding-left: 42px;">
        <!-- Curved connector ╰ -->
        <div
          class="absolute rounded-bl-2xl border-l-2 border-b-2 border-base-200 dark:border-base-800"
          style="left: 17px; top: 0; width: 25px; height: 34px;"
        ></div>
        <!-- Vertical continuation for non-last replies -->
        {#if !isLast}
          <div
            class="absolute w-0.5 bg-base-200 dark:bg-base-800"
            style="left: 17px; top: 0; bottom: 0;"
          ></div>
        {/if}
        <svelte:self
          comment={reply}
          depth={depth + 1}
          {appId}
          {pageId}
          {serverURL}
          {onRefresh}
        />
      </div>
    {/each}
  {:else if expanded && comment.replies?.data?.length > 0 && depth > 4}
    <div style="padding-left: 42px;">
      <button
        class="mt-3 text-sm text-accent-600 dark:text-accent-400 hover:underline font-medium"
      >
        답글 {comment.replies.commentCount}개 더 보기
      </button>
    </div>
  {/if}
</div>
