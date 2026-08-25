<script lang="ts" module>
	import type { Snippet } from "svelte"
	import type { NavLink, SearchConfig } from "./types.ts"

	export type Props = {
		nav?: NavLink[]
		search?: SearchConfig
		github?: string
		logo?: Snippet
		home?: string
	}
</script>

<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte"
	import * as Sidebar from "$lib/components/ui/sidebar"
	import ThemeSwitcher from "./theme-switcher.svelte"
	import Github from "./github.svelte"
	import Shadcn from "./shadcn.svelte"
	let { nav = [], search, github, logo, home = "/" }: Props = $props()
</script>

<header class="sticky top-0 z-50 flex w-full items-center bg-background/80 px-6 py-2 backdrop-blur-md **:data-[slot=separator]:h-4!">
	<Sidebar.Trigger class="lg:hidden" />
	<Button class="hidden lg:flex" variant="ghost" size="icon" href={home}>
		{#if logo}
			{@render logo()}
		{:else}
			<Shadcn />
		{/if}
	</Button>
	<nav class="hidden items-center gap-0 lg:flex">
		{#each nav as link (link.label)}
			<Button size="sm" variant="ghost" href={link.href}>{link.label}</Button>
		{/each}
	</nav>
	<div class="ml-auto flex items-center gap-2">
		{#if search}
			<Button
				variant="outline"
				class="h-8 justify-start rounded-lg border-none bg-muted pl-3 text-foreground shadow-none hover:bg-muted/50 md:w-48 lg:w-40 xl:w-64 dark:bg-card"
				onclick={() => search.onSearch()}
			>
				<span class="hidden xl:inline-flex">{search.placeholder}</span>
				<span class="inline-flex xl:hidden">{search.shortPlaceholder ?? search.placeholder}</span>
			</Button>
		{/if}
		{#if github}
			<Button variant="ghost" size="icon-sm" href={github} target="_blank">
				<Github />
			</Button>
		{/if}
		<ThemeSwitcher />
	</div>
</header>
