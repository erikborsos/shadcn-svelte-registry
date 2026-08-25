<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar"
	import { page } from "$app/state"
	import type { SidebarGroup } from "./types.ts"

	let { items = [] }: { items: SidebarGroup[] } = $props()
</script>

<Sidebar.Root
	class="fixed top-16 hidden h-[calc(100svh-4rem)] w-60 shrink-0 flex-col overscroll-none bg-transparent lg:flex"
	collapsible="none"
>
	<Sidebar.Content class="no-scrollbar gap-0 overflow-auto px-2 py-4">
		{#each items as group (group.label)}
			<Sidebar.Group>
				{#if group.href}
					<Sidebar.MenuButton isActive={page.url.pathname === group.href}>
						{#snippet child({ props })}
							<a href={group.href} {...props}>{group.label}</a>
						{/snippet}
					</Sidebar.MenuButton>
				{:else}
					<Sidebar.GroupLabel>{group.label}</Sidebar.GroupLabel>
				{/if}
				{#if group.items?.length}
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							<Sidebar.MenuSub>
								{#each group.items as item (item.href)}
									<Sidebar.MenuSubItem>
										<Sidebar.MenuSubButton isActive={page.url.pathname === item.href}>
											{#snippet child({ props })}
												<a href={item.href} {...props}>{item.label}</a>
											{/snippet}
										</Sidebar.MenuSubButton>
									</Sidebar.MenuSubItem>
								{/each}
							</Sidebar.MenuSub>
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				{/if}
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
</Sidebar.Root>
