<script lang="ts">
	import { getContext } from "svelte"
	import { base } from "$app/paths"
	import type { RegistryEntry, RegistryKind } from "$lib/registry"
	import { installCommands } from "$lib/registry"
	import { CodeBlock } from "$lib/registry/components/code-block"

	let { kind, item }: { kind: RegistryKind; item: RegistryEntry } = $props()

	const setToc =
		getContext<(items: { title: string; url: string; depth: number }[]) => void>("setToc")

	const commands = $derived(installCommands(item))

	// svelte-ignore state_referenced_locally
	setToc([
		{ title: "Preview", url: "#preview", depth: 2 },
		...(commands.length ? [{ title: "Installation", url: "#installation", depth: 2 }] : []),
		...(item.examples.length
			? [
					{ title: "Examples", url: "#examples", depth: 2 },
					...item.examples.map((example) => ({
						title: example.title,
						url: `#example-${example.name}`,
						depth: 3
					}))
				]
			: [])
	])
</script>

<a
	href="{base}/docs/{kind}"
	class="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
>
	&larr; Back to {kind}
</a>

<h1 class="scroll-m-24 text-3xl font-semibold tracking-tight">{item.title}</h1>
{#if item.description}
	<p class="text-muted-foreground sm:text-balance">{item.description}</p>
{/if}

<h2 id="preview" class="scroll-m-24 text-2xl font-semibold tracking-tight">Preview</h2>
<div
	class="flex min-h-48 items-center justify-center rounded-xl border bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[12px_12px] p-8"
>
	{#if item.demo}
		<item.demo />
	{:else}
		<span class="text-sm text-muted-foreground">
			Add a <code>demo.svelte</code> next to this item (or in its <code>examples/</code> folder) to render
			a preview.
		</span>
	{/if}
</div>

{#if commands.length}
	<h2 id="installation" class="scroll-m-24 text-2xl font-semibold tracking-tight">Installation</h2>
	<CodeBlock files={commands} />
{/if}

{#if item.examples.length}
	<h2 id="examples" class="scroll-m-24 text-2xl font-semibold tracking-tight">Examples</h2>
	<div class="flex flex-col gap-10">
		{#each item.examples as example (example.name)}
			<section id={"example-" + example.name} class="flex scroll-m-24 flex-col gap-8">
				<div class="flex flex-col gap-1">
					<h3 class="text-lg font-semibold tracking-tight">{example.title}</h3>
					{#if example.description}
						<p class="text-sm text-muted-foreground">{example.description}</p>
					{/if}
				</div>
				<div>
					<div
						class="flex min-h-24 items-center justify-center rounded-xl rounded-b-none border bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[12px_12px] p-8"
					>
						<example.component />
					</div>
					{#if example.source}
						<CodeBlock
							class="mx-px rounded-t-none"
							header={false}
							name={`${example.name}.svelte`}
							lang="svelte"
							code={example.source}
						/>
					{/if}
				</div>
			</section>
		{/each}
	</div>
{/if}
