<script lang="ts">
	import { onMount } from "svelte"
	import type { TocItem } from "./types.ts"

	let { toc = [], title = "On This Page" }: { toc: TocItem[]; title?: string } = $props()

	let activeId = $state<string | null>(null)

	onMount(() => {
		const itemIds = toc.map((item) => item.url.replace("#", ""))

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeId = entry.target.id
					}
				}
			},
			{ rootMargin: "0% 0% -80% 0%" }
		)

		for (const id of itemIds) {
			const element = document.getElementById(id)
			if (element) observer.observe(element)
		}

		return () => {
			for (const id of itemIds) {
				const element = document.getElementById(id)
				if (element) observer.unobserve(element)
			}
		}
	})
</script>

{#if toc.length}
	<div class="no-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto p-4 pt-0 text-sm">
		<p class="sticky top-0 h-6 bg-background text-xs font-medium text-muted-foreground">
			{title}
		</p>
		{#each toc as item (item.url)}
			<a
				href={item.url}
				class="text-[0.8rem] text-muted-foreground no-underline transition-colors hover:text-foreground data-[active=true]:font-medium data-[active=true]:text-foreground"
				data-active={item.url === `#${activeId}`}
				style:padding-left="{(item.depth - 2) * 1}rem"
			>
				{item.title}
			</a>
		{/each}
	</div>
{/if}
