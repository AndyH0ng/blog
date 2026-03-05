<script lang="ts">
  import { onMount } from "svelte";
  import { CUSDIS_APP_ID, CUSDIS_SERVER_URL } from "../../config";
  import type { CusdisComment, CommentsResponse } from "./types";
  import CusdisCommentComponent from "./CusdisComment.svelte";
  import CusdisReplyForm from "./CusdisReplyForm.svelte";

  let comments: CusdisComment[] = $state([]);
  let commentCount = $state(0);
  let loading = $state(true);

  const pageId =
    typeof window !== "undefined" ? window.location.pathname : "";

  async function fetchComments() {
    try {
      const res = await fetch(
        `${CUSDIS_SERVER_URL}/api/open/comments?appId=${CUSDIS_APP_ID}&pageId=${encodeURIComponent(pageId)}`,
      );
      const json: CommentsResponse = await res.json();
      comments = json.data.data;
      commentCount = json.data.commentCount;
    } catch {
      comments = [];
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    fetchComments();
  });
</script>

<div class="not-prose mt-8">
  {#if !loading && commentCount > 0}
    <div class="text-lg text-base-950 dark:text-base-100 font-semibold">
      댓글 {commentCount}개
    </div>
  {/if}

  <div class="mt-5">
    <CusdisReplyForm
      appId={CUSDIS_APP_ID}
      pageId={pageId}
      serverURL={CUSDIS_SERVER_URL}
      onSubmit={fetchComments}
    />
  </div>

  {#if loading}
    <div class="pt-5 text-base text-base-500">댓글을 불러오는 중...</div>
  {:else if comments.length > 0}
    <div class="pt-2 divide-y divide-base-100 dark:divide-base-800/50">
      {#each comments as comment}
        <CusdisCommentComponent
          {comment}
          appId={CUSDIS_APP_ID}
          {pageId}
          serverURL={CUSDIS_SERVER_URL}
          onRefresh={fetchComments}
        />
      {/each}
    </div>
  {/if}
</div>
