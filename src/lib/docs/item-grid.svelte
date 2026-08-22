<script lang="ts">
	import { getContext } from "svelte"
	import type { RegistryEntry, RegistryKind } from "$lib/registry"
	import { itemHref } from "$lib/registry"

	let {
		kind,
		title,
		description,
		items
	}: { kind: RegistryKind; title: string; description: string; items: RegistryEntry[] } = $props()

	const setToc =
		getContext<(items: { title: string; url: string; depth: number }[]) => void>("setToc")
	setToc([])
</script>

<h1 class="scroll-m-24 text-3xl font-semibold tracking-tight">{title}</h1>
<p class="text-muted-foreground sm:text-balance">{description}</p>

{#if items.length}
	<div class="grid gap-4 sm:grid-cols-2">
		{#each items as item (item.name)}
			<a
				href={itemHref(kind, item.name)}
				class="group flex flex-col gap-3 rounded-xl border bg-card p-4 no-underline transition-colors hover:bg-muted/50"
			>
				<div
					class="pointer-events-none flex h-36 items-center justify-center overflow-hidden rounded-lg border bg-muted/40 p-4"
				>
					{#if item.demo}
						<item.demo />
					{:else}
						<span class="text-xs text-muted-foreground">No preview</span>
					{/if}
				</div>
				<div class="flex flex-col gap-1">
					<span class="font-medium group-hover:underline">{item.title}</span>
					{#if item.description}
						<span class="line-clamp-2 text-sm text-muted-foreground">{item.description}</span>
					{/if}
				</div>
			</a>
		{/each}
	</div>
{:else}
	<div class="flex flex-col items-center gap-1 rounded-xl border border-dashed p-10 text-center">
		<p class="text-sm font-medium">Nothing here yet</p>
		<p class="text-sm text-muted-foreground">
			Add an item to <code>registry.json</code> and it will show up here automatically.
		</p>
	</div>
{/if}
