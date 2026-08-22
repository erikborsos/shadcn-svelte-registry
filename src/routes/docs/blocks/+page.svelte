<script lang="ts">
	import ItemGrid from "$lib/docs/item-grid.svelte"
	import { blocks } from "$lib/registry"
</script>

<ItemGrid
	kind="blocks"
	title="Blocks"
	description="Composable sections and page shells. Add them to registry.json and they appear here automatically."
	items={blocks}
/>
