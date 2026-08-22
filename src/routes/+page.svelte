<script lang="ts">
	import { getContext } from "svelte"

	const setToc =
		getContext<(items: { title: string; url: string; depth: number }[]) => void>("setToc")
	setToc([])
</script>
