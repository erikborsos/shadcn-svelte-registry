<script module lang="ts">
	import type { Component } from "svelte"
	import type { HTMLAttributes } from "svelte/elements"

	export type CodeBlockFile = {
		name: string
		lang: string
		code: string
	}

	export type CodeBlockProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		showLineNumbers?: boolean
		header?: boolean
		icon?: Component<{ class?: string; [key: string]: unknown }>
	} & (
			| {
					files: CodeBlockFile[]
					name?: never
					lang?: never
					code?: never
			  }
			| {
					files?: never
					name: string
					lang: string
					code: string
			  }
		)
</script>

<script lang="ts">
	import * as Tabs from "$lib/components/ui/tabs"
	import { Button } from "$lib/components/ui/button"
	import { Card, CardHeader } from "$lib/components/ui/card"
	import { cn, type WithElementRef } from "$lib/utils.js"
	import CheckIcon from "@lucide/svelte/icons/check"
	import CopyIcon from "@lucide/svelte/icons/copy"
	import { getCachedHtml, highlightCodeCached } from "./highlight.js"

	let {
		ref = $bindable(null),
		class: className,
		showLineNumbers = false,
		header = true,
		icon,
		files,
		name,
		lang,
		code,
		...restProps
	}: CodeBlockProps = $props()

	const list: CodeBlockFile[] = $derived(
		files ?? (name != null && lang != null && code != null ? [{ name, lang, code }] : [])
	)

	const single = $derived(list.length === 1)

	// Only initial value is used; state is managed locally
	// svelte-ignore state_referenced_locally
	let activeName = $state<string>(list[0]?.name ?? "")
	const active = $derived<CodeBlockFile>(list.find((f) => f.name === activeName) ?? list[0])

	const htmlByFile = $derived(() => {
		const map = new Map<string, Promise<string>>()
		for (const file of list) {
			map.set(file.name, highlightCodeCached(file.code, file.lang))
		}
		return map
	})

	const getHtml = (file: CodeBlockFile) => htmlByFile().get(file.name) ?? Promise.resolve("")

	let copied = $state(false)
	let copyTimer: number | undefined

	async function copy(value: string) {
		try {
			await navigator.clipboard.writeText(value)
		} catch {
			return
		}
		copied = true
		window.clearTimeout(copyTimer)
		copyTimer = window.setTimeout(() => (copied = false), 2000)
	}
</script>

{#snippet copyButton(raw: string)}
	<Button
		variant="ghost"
		size="icon-sm"
		class="text-muted-foreground hover:text-foreground"
		aria-label={copied ? "Copied" : "Copy code"}
		disabled={!raw}
		onclick={() => copy(raw)}
	>
		{#if copied}<CheckIcon class="text-primary" />{:else}<CopyIcon />{/if}
	</Button>
{/snippet}

{#snippet pane(file: CodeBlockFile, bordered = true)}
	{@const cached = getCachedHtml(file.code, file.lang)}
	<div
		class={cn("code-block-body", bordered && "border-t")}
		data-line-numbers={showLineNumbers ? "" : undefined}
	>
		{#if cached}
			{@html cached}
		{:else}
			{#await getHtml(file)}
				<pre class="code-block-fallback" aria-busy="true">{file.code}</pre>
			{:then html}
				{@html html}
			{/await}
		{/if}
	</div>
{/snippet}

<Card bind:ref class={cn("code-block group/code gap-0 py-0", className)} {...restProps}>
	{@const Icon = icon}
	{#if single}
		{#if header}
			<CardHeader
				class="flex h-10 items-center justify-between gap-2 bg-muted/40 [--card-spacing:--spacing(3)]"
			>
				<div class="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
					{#if Icon}
						<Icon class="size-4 shrink-0" />
					{/if}
					<span class="truncate font-medium">{list[0].name}</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="hidden text-xs text-muted-foreground sm:inline">
						{list[0].lang}
					</span>
					{@render copyButton(list[0].code)}
				</div>
			</CardHeader>
		{/if}
		<div class="relative">
			{@render pane(list[0], header)}
			{#if !header}
				<div
					class="absolute top-2 right-2 z-10 opacity-0 transition-opacity duration-150 group-hover/code:opacity-100 focus-within:opacity-100"
				>
					{@render copyButton(list[0].code)}
				</div>
			{/if}
		</div>
	{:else if list.length > 0}
		<Tabs.Root bind:value={activeName} class="gap-0">
			<CardHeader
				class="flex h-10 items-center justify-between gap-2 bg-muted/40 [--card-spacing:--spacing(2)]"
			>
				<div class="max-w-full overflow-x-auto">
					<Tabs.List variant="line" class="h-10 gap-0.5 bg-transparent p-0">
						{#each list as file (file.name)}
							<Tabs.Trigger value={file.name} class="h-10 gap-1 px-2 sm:gap-1.5 sm:px-3">
								{#if Icon}
									<Icon class="size-4" data-icon="inline-start" />
								{/if}
								{file.name}
							</Tabs.Trigger>
						{/each}
					</Tabs.List>
				</div>
				{@render copyButton(active?.code ?? "")}
			</CardHeader>
			{#each list as file (file.name)}
				<Tabs.Content value={file.name} class="mt-0">
					{@render pane(file)}
				</Tabs.Content>
			{/each}
		</Tabs.Root>
	{/if}
</Card>

<style>
	:global(.code-block-body) {
		overflow-x: auto;
		scrollbar-width: thin;
	}

	/* ---- Code block (shiki) ---- */
	:global(.code-block-body .shiki) {
		margin: 0;
		padding: 1rem 0;
		background-color: transparent !important;
		font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
		font-size: 0.8125rem;
		line-height: 1.6;
	}

	:global(.code-block-body .shiki code) {
		display: grid;
	}

	:global(.code-block-body .code-block-fallback) {
		margin: 0;
		padding: 1rem 1.5rem;
		font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
		font-size: 0.8125rem;
		line-height: 1.6;
	}

	:global(.code-block-body .shiki .line) {
		padding-inline: 1rem 1.5rem;
		min-height: 1.6em;
	}

	:global(.code-block-body[data-line-numbers] .shiki .line) {
		padding-left: 0;
	}

	:global(.code-block-body[data-line-numbers] .shiki .code-block-gutter) {
		display: inline-block;
		position: sticky;
		left: 0;
		width: 2.5rem;
		padding-right: 0.75rem;
		text-align: right;
		color: color-mix(in oklab, var(--muted-foreground) 60%, transparent);
		background-color: var(--color-card);
		z-index: 1;
	}

	:global(.code-block-body:not([data-line-numbers]) .shiki .code-block-gutter) {
		display: none;
	}

	:global(.code-block-body .shiki),
	:global(.code-block-body .shiki span) {
		color: var(--shiki-light);
	}

	:global(.dark .code-block-body .shiki),
	:global(.dark .code-block-body .shiki span) {
		color: var(--shiki-dark);
	}

	@media (max-width: 640px) {
		:global(.code-block-body .shiki),
		:global(.code-block-body .code-block-fallback) {
			font-size: 0.75rem;
			line-height: 1.55;
		}

		:global(.code-block-body .shiki) {
			padding: 0.75rem 0;
		}

		:global(.code-block-body .code-block-fallback) {
			padding: 0.75rem 1.25rem;
		}

		:global(.code-block-body .shiki .line) {
			padding-inline: 0.75rem 1.25rem;
		}

		:global(.code-block-body[data-line-numbers] .shiki .code-block-gutter) {
			width: 2rem;
			padding-right: 0.5rem;
		}
	}
</style>
