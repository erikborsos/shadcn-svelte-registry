import { error } from "@sveltejs/kit"
import { components } from "$lib/registry"
import type { EntryGenerator, PageLoad } from "./$types"

export const entries: EntryGenerator = () => components.map((c) => ({ slug: c.name }))

export const load: PageLoad = ({ params }) => {
	if (!components.some((c) => c.name === params.slug)) {
		error(404, "Component not found")
	}
}
