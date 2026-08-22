<script lang="ts">
	import { setContext } from "svelte"
	import { base } from "$app/paths"
	import AppHeader from "./app-header.svelte"
	import DocsSidebar from "./docs-sidebar.svelte"
	import TableOfContents from "./table-of-contents.svelte"
	import * as Sidebar from "$lib/components/ui/sidebar"
	import { sidebarItems } from "$lib/registry"

	let { children } = $props()

	let toc = $state<{ title: string; url: string; depth: number }[]>([])

	setContext("setToc", (items: { title: string; url: string; depth: number }[]) => {
		toc = items
	})
</script>

<Sidebar.Provider>
	<div class="flex min-h-screen w-full flex-col">
		<AppHeader
			shortcuts={[
				{ label: "Docs", href: `${base}/docs` },
				{ label: "Components", href: `${base}/docs/components` },
				{ label: "Blocks", href: `${base}/docs/blocks` }
			]}
			search={{
				placeholder: "Search documentation...",
				shortPlaceholder: "Search...",
				onSearch: () => {}
			}}
			github="https://github.com/erikborsos/shadcn-svelte-registry"
		/>
		<div class="flex flex-1 px-2">
			<DocsSidebar items={sidebarItems} />
			<main class="flex min-w-0 flex-1">
				<div
					class="mx-auto flex w-full max-w-3xl min-w-0 flex-1 flex-col gap-6 px-4 py-6 md:px-0 lg:py-8"
				>
					{@render children()}
				</div>
				{#if toc.length}
					<div
						class="fixed top-24 right-0 z-30 hidden h-[calc(100svh-6rem)] w-72 flex-col gap-4 overscroll-none pr-4 pb-8 xl:flex"
					>
						<TableOfContents {toc} />
					</div>
				{/if}
			</main>
		</div>
	</div>
</Sidebar.Provider>
