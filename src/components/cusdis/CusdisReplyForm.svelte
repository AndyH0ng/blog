<script lang="ts">
  const {
    appId,
    pageId,
    serverURL,
    parentId = null,
    onSubmit,
  }: {
    appId: string;
    pageId: string;
    serverURL: string;
    parentId?: string | null;
    onSubmit?: () => void;
  } = $props();

  let nickname = $state("");
  let email = $state("");
  let content = $state("");
  let submitting = $state(false);
  let message = $state("");

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) return;
    submitting = true;
    message = "";

    try {
      const res = await fetch(`${serverURL}/api/open/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId,
          pageId,
          content: content.trim(),
          nickname: nickname.trim(),
          email: email.trim() || undefined,
          parentId,
        }),
      });

      if (res.ok) {
        content = "";
        message = "댓글이 등록되었습니다. 승인 후 표시됩니다.";
        onSubmit?.();
      }
    } catch {
      message = "댓글 등록에 실패했습니다.";
    } finally {
      submitting = false;
    }
  }
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-3">
  <div class="flex gap-3">
    <input
      bind:value={nickname}
      placeholder="닉네임 *"
      required
      class="flex-1 rounded-lg border border-base-200 dark:border-base-800 bg-base-50 dark:bg-base-950 px-3 py-2 text-sm text-base-900 dark:text-base-100 placeholder:text-base-400 dark:placeholder:text-base-600 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
    />
    <input
      bind:value={email}
      type="email"
      placeholder="이메일 (선택)"
      class="flex-1 rounded-lg border border-base-200 dark:border-base-800 bg-base-50 dark:bg-base-950 px-3 py-2 text-sm text-base-900 dark:text-base-100 placeholder:text-base-400 dark:placeholder:text-base-600 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
    />
  </div>
  <textarea
    bind:value={content}
    placeholder="댓글을 작성하세요..."
    required
    rows="3"
    class="w-full rounded-lg border border-base-200 dark:border-base-800 bg-base-50 dark:bg-base-950 px-3 py-2 text-sm text-base-900 dark:text-base-100 placeholder:text-base-400 dark:placeholder:text-base-600 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 resize-none"
  ></textarea>
  <div class="flex items-center justify-between">
    {#if message}
      <span class="text-xs text-base-500">{message}</span>
    {:else}
      <span></span>
    {/if}
    <button
      type="submit"
      disabled={submitting || !nickname.trim() || !content.trim()}
      class="px-4 py-1.5 rounded-lg bg-accent-600 text-white text-sm font-medium hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {submitting ? "등록 중..." : "댓글 작성"}
    </button>
  </div>
</form>
