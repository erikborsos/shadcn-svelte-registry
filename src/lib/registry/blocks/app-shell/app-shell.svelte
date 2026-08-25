<script lang="ts">
	import { setContext } from "svelte"
	import AppHeader from "./app-header.svelte"
	import DocsSidebar from "./docs-sidebar.svelte"
	import TableOfContents from "./table-of-contents.svelte"
	import * as Sidebar from "$lib/components/ui/sidebar"
	import type { AppShellProps, TocItem } from "./types.ts"

	let {
		children,
		nav = [],
		sidebar = [],
		search,
		github,
		logo,
		home,
		toc = true
	}: AppShellProps = $props()

	let tocItems = $state<TocItem[]>([])

	setContext("setToc", (items: TocItem[]) => {
		tocItems = items
	})
</script>

<Sidebar.Provider>
	<div class="flex min-h-screen w-full flex-col">
		<AppHeader {nav} {search} {github} {logo} {home} />
		<div class="flex flex-1 px-2">
			<DocsSidebar items={sidebar} />
			<main class="flex min-w-0 flex-1">
				<div
					class="mx-auto flex w-full max-w-3xl min-w-0 flex-1 flex-col gap-6 px-4 py-6 md:px-0 lg:py-8"
				>
					{@render children()}
				</div>
				{#if toc && tocItems.length}
					<div
						class="fixed top-24 right-0 z-30 hidden h-[calc(100svh-6rem)] w-72 flex-col gap-4 overscroll-none pr-4 pb-8 xl:flex"
					>
						<TableOfContents toc={tocItems} />
					</div>
				{/if}
			</main>
		</div>
	</div>
</Sidebar.Provider>
