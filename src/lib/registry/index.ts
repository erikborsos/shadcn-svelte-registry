import type { Component } from "svelte"
import { base } from "$app/paths"

export type RegistryFile = {
	path: string
	type: string
	target?: string
}

export type RegistryItem = {
	name: string
	type: string
	title?: string
	description?: string
	dependencies?: string[]
	registryDependencies?: string[]
	files?: RegistryFile[]
}

export type ExampleEntry = {
	name: string
	title: string
	description: string
	component: Component
	source: string
}

export type RegistryEntry = RegistryItem & {
	title: string
	description: string
	demo?: Component
	examples: ExampleEntry[]
}

export type RegistryKind = "components" | "blocks"

type RegistryConfig = {
	name: string
	homepage?: string
	items: RegistryItem[]
}

const rawRegistry = import.meta.glob<string>("/registry.json", {
	query: "?raw",
	import: "default",
	eager: true
})

const registry = JSON.parse(rawRegistry["/registry.json"]) as RegistryConfig

type ExampleModule = { default: Component; title?: string; description?: string }

const demoModules = import.meta.glob<{ default: Component }>("/src/lib/registry/**/demo.svelte", {
	eager: true
})

const exampleModules = import.meta.glob<ExampleModule>("/src/lib/registry/**/examples/*.svelte", {
	eager: true
})

const exampleRawModules = import.meta.glob<string>("/src/lib/registry/**/examples/*.svelte", {
	query: "?raw",
	import: "default",
	eager: true
})

// name of the item folder a registry file lives in (ignores an "examples" segment)
const itemName = (path: string) =>
	path
		.split("/")
		.filter((part) => part !== "examples")
		.at(-2)

const demos = new Map<string, Component>()
for (const [path, module] of Object.entries(demoModules)) {
	const name = itemName(path)
	if (name) demos.set(name, module.default)
}

// raw sources keyed by normalized path (glob keys may carry a query suffix)
const exampleSources = new Map<string, string>()
for (const [path, source] of Object.entries(exampleRawModules)) {
	exampleSources.set(path.replace(/\.svelte(\?.*)?$/, ".svelte"), source)
}

const titleCase = (name: string) =>
	name
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")

const examplesByItem = new Map<string, ExampleEntry[]>()
for (const [path, module] of Object.entries(exampleModules)) {
	const baseName = (path.split("/").at(-1) ?? "").replace(/\.svelte$/, "")
	if (!baseName || baseName === "demo") continue // demo.svelte is rendered in Preview
	const name = itemName(path)
	if (!name) continue
	const list = examplesByItem.get(name) ?? []
	list.push({
		name: baseName,
		title: module.title ?? titleCase(baseName),
		description: module.description ?? "",
		component: module.default,
		source: exampleSources.get(path.replace(/\.svelte(\?.*)?$/, ".svelte")) ?? ""
	})
	examplesByItem.set(name, list)
}

function enrich(item: RegistryItem): RegistryEntry {
	return {
		...item,
		title: item.title ?? titleCase(item.name),
		description: item.description ?? "",
		demo: demos.get(item.name),
		examples: examplesByItem.get(item.name) ?? []
	}
}

export const registryName = registry.name

export const registryItems: RegistryEntry[] = registry.items.map(enrich)

const byTitle = (a: RegistryEntry, b: RegistryEntry) => a.title.localeCompare(b.title)

export const components: RegistryEntry[] = registryItems
	.filter((item) => item.type === "registry:component")
	.sort(byTitle)

export const blocks: RegistryEntry[] = registryItems
	.filter((item) => item.type === "registry:block")
	.sort(byTitle)

export function getItems(kind: RegistryKind): RegistryEntry[] {
	return kind === "components" ? components : blocks
}

export function getItem(kind: RegistryKind, name: string): RegistryEntry | undefined {
	return getItems(kind).find((item) => item.name === name)
}

export function itemHref(kind: RegistryKind, name: string): string {
	return `${base}/docs/${kind}/${name}`
}

export function installCommand(item: RegistryEntry): string {
	const target = registry.homepage ? `${registry.homepage}/r/${item.name}.json` : item.name
	return `npx shadcn-svelte@latest add ${target}`
}

const packageManagerRunners: Record<string, string> = {
	npm: "npx shadcn-svelte@latest add",
	yarn: "yarn dlx shadcn-svelte@latest add",
	pnpm: "pnpm dlx shadcn-svelte@latest add",
	bun: "bunx --bun shadcn-svelte@latest add"
}

export function installCommands(item: RegistryEntry) {
	const target = registry.homepage ? `${registry.homepage}/r/${item.name}.json` : item.name
	return Object.entries(packageManagerRunners).map(([name, runner]) => ({
		name,
		lang: "bash",
		code: `${runner} ${target}`
	}))
}

export type SidebarGroup = {
	label: string
	href?: string
	items?: { label: string; href: string }[]
}

export const sidebarItems: SidebarGroup[] = [
	{ label: "Introduction", href: `${base}/docs` },
	...(components.length
		? [
				{
					label: "Components",
					items: components.map((c) => ({ label: c.title, href: itemHref("components", c.name) }))
				}
			]
		: []),
	...(blocks.length
		? [
				{
					label: "Blocks",
					items: blocks.map((b) => ({ label: b.title, href: itemHref("blocks", b.name) }))
				}
			]
		: [])
]
