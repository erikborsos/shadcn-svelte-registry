<script lang="ts">
	import "./layout.css"
	import favicon from "$lib/assets/favicon.svg"
	import { ModeWatcher } from "mode-watcher"
	import AppShell from "$lib/registry/blocks/app-shell/app-shell.svelte"

	let { children } = $props()
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher />
<AppShell>
	{@render children()}
</AppShell>
