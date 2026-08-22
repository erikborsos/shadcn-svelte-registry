<script lang="ts">
	import ItemGrid from "$lib/docs/item-grid.svelte"
	import { components } from "$lib/registry"
</script>

<ItemGrid
	kind="components"
	title="Components"
	description="Ready to use building blocks for your app. Add them to registry.json and they appear here automatically."
	items={components}
/>
