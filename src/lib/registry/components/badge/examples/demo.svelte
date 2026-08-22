<script lang="ts" module>
	export const title = "Demo"
	export const description = "Basic usage of the Badge component with all available variants."
</script>

<script lang="ts">
	import { Badge } from "../index.ts"
</script>

<div class="flex flex-wrap items-center gap-2">
	<Badge>Default</Badge>
	<Badge variant="secondary">Secondary</Badge>
	<Badge variant="destructive">Destructive</Badge>
	<Badge variant="outline">Outline</Badge>
</div>
