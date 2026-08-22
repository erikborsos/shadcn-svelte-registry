<script lang="ts">
	import { page } from "$app/state"
	import ItemDetail from "$lib/docs/item-detail.svelte"
	import { getItem } from "$lib/registry"

	const item = $derived(getItem("blocks", page.params.slug!))
</script>

{#if item}
	{#key item.name}
		<ItemDetail kind="blocks" {item} />
	{/key}
{/if}
