<script lang="ts" module>
	export const title = "Link"
	export const description = "Wrap a Badge in an anchor to make it clickable."
</script>

<script lang="ts">
	import { Badge } from "../index.ts"
</script>

<div class="flex flex-wrap items-center gap-2">
	<a href="https://example.com" class="no-underline" target="_blank" rel="noreferrer">
		<Badge>Repository</Badge>
	</a>
	<a href="https://example.com" class="no-underline" target="_blank" rel="noreferrer">
		<Badge variant="outline">Documentation</Badge>
	</a>
</div>
