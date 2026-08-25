<script lang="ts">
	import "./layout.css"
	import favicon from "$lib/assets/favicon.svg"
	import { ModeWatcher } from "mode-watcher"
	import AppShell from "$lib/registry/blocks/app-shell/app-shell.svelte"
	import { sidebarItems } from "$lib/registry"
	import { resolve } from "$app/paths"

	let { children } = $props()
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher />
<AppShell
	home={resolve("/")}
	nav={[
		{ label: "Docs", href: resolve("/docs") },
		{ label: "Components", href: resolve("/docs/components") },
		{ label: "Blocks", href: resolve("/docs/blocks") }
	]}
	sidebar={sidebarItems}
	search={{
		placeholder: "Search documentation...",
		shortPlaceholder: "Search...",
		onSearch: () => {}
	}}
	github="https://github.com/erikborsos/shadcn-svelte-registry"
>
	{@render children()}
</AppShell>
