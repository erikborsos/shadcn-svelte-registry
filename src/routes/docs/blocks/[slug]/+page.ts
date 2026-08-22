import { error } from "@sveltejs/kit"
import { blocks } from "$lib/registry"
import type { EntryGenerator, PageLoad } from "./$types"

export const entries: EntryGenerator = () => blocks.map((b) => ({ slug: b.name }))

export const load: PageLoad = ({ params }) => {
	if (!blocks.some((b) => b.name === params.slug)) {
		error(404, "Block not found")
	}
}
