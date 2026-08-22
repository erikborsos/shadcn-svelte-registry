<script lang="ts" module>
	export type Props = {
		shortcuts: { label: string; href: string }[]
		search?: { placeholder: string; shortPlaceholder?: string; onSearch: () => void }
		github?: string
	}
</script>

<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte"
	import * as Sidebar from "$lib/components/ui/sidebar"
	import ThemeSwitcher from "./theme-switcher.svelte"
	import Github from "./github.svelte"
	import Shadnc from "./shadnc.svelte"
	import { cn } from "$lib/utils"
	import { base } from "$app/paths"

	let { shortcuts, search, github }: Props = $props()
</script>

<header class="sticky top-0 z-50 w-full bg-background/80 py-2 backdrop-blur-md">
	<div class="px-6">
		<div class="flex h-13 items-center **:data-[slot=separator]:h-4!">
			<Sidebar.Trigger class="lg:hidden" />
			<Button class="hidden lg:flex" variant="ghost" size="icon" href={base || "/"}>
				<Shadnc />
			</Button>
			<nav class="hidden items-center gap-0 lg:flex">
				{#each shortcuts as shortcut (shortcut.label)}
					<Button size="sm" variant="ghost" href={shortcut.href}>{shortcut.label}</Button>
				{/each}
			</nav>
			<div class="ml-auto flex items-center gap-2">
				{#if search}
					<Button
						variant="outline"
						class={cn(
							"relative h-8 justify-start rounded-lg border-none bg-muted pl-3 text-foreground shadow-none transition-colors hover:bg-muted/50 md:w-48 lg:w-40 xl:w-64 dark:bg-card"
						)}
						onclick={() => search.onSearch()}
					>
						<span class="hidden xl:inline-flex">{search.placeholder}</span>
						<span class="inline-flex xl:hidden">
							{search.shortPlaceholder ?? search.placeholder}</span
						>
					</Button>
				{/if}
				{#if github}
					<Button variant="ghost" size="icon-sm" href={github} target="_blank">
						<Github />
					</Button>
				{/if}
				<ThemeSwitcher />
			</div>
		</div>
	</div>
</header>
