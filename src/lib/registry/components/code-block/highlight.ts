import type { createHighlighterCore } from "shiki/core"

export async function highlightCode(code: string, lang: string): Promise<string> {
	const highlighter = await getHighlighter()
	const id = normalizeLang(lang)
	const load = LANGUAGE_LOADERS[id]
	if (id !== "plaintext" && load) {
		await loadLanguage(highlighter, id, load)
	}
	return highlighter.codeToHtml(code.trimEnd(), {
		lang: id in LANGUAGE_LOADERS ? id : "plaintext",
		themes: {
			light: "github-light",
			dark: "github-dark"
		},
		defaultColor: false,
		transformers: [
			{
				name: "code-block-line-numbers",
				line(hast, line) {
					hast.children.unshift({
						type: "element",
						tagName: "span",
						properties: { class: "code-block-gutter" },
						children: [{ type: "text", value: String(line) }]
					})
				}
			}
		]
	})
}

type Highlighter = Awaited<ReturnType<typeof createHighlighterCore>>
type LanguageLoader = () => Promise<{
	default: Parameters<Highlighter["loadLanguage"]>[0]
}>

const LANG_ALIASES: Record<string, string> = {
	ts: "typescript",
	tsx: "tsx",
	js: "javascript",
	jsx: "jsx",
	sh: "bash",
	shell: "bash",
	zsh: "bash",
	yml: "yaml",
	md: "markdown",
	py: "python",
	rb: "ruby",
	text: "plaintext",
	txt: "plaintext"
}

function normalizeLang(lang: string): string {
	return LANG_ALIASES[lang.toLowerCase()] ?? lang.toLowerCase()
}

// languages fall back to plaintext.
const LANGUAGE_LOADERS: Record<string, LanguageLoader> = {
	typescript: () => import("@shikijs/langs/typescript"),
	javascript: () => import("@shikijs/langs/javascript"),
	tsx: () => import("@shikijs/langs/tsx"),
	jsx: () => import("@shikijs/langs/jsx"),
	svelte: () => import("@shikijs/langs/svelte"),
	vue: () => import("@shikijs/langs/vue"),
	html: () => import("@shikijs/langs/html"),
	css: () => import("@shikijs/langs/css"),
	scss: () => import("@shikijs/langs/scss"),
	json: () => import("@shikijs/langs/json"),
	jsonc: () => import("@shikijs/langs/jsonc"),
	yaml: () => import("@shikijs/langs/yaml"),
	markdown: () => import("@shikijs/langs/markdown"),
	mdx: () => import("@shikijs/langs/mdx"),
	bash: () => import("@shikijs/langs/bash"),
	python: () => import("@shikijs/langs/python"),
	php: () => import("@shikijs/langs/php"),
	ruby: () => import("@shikijs/langs/ruby"),
	rust: () => import("@shikijs/langs/rust"),
	go: () => import("@shikijs/langs/go"),
	cpp: () => import("@shikijs/langs/cpp"),
	c: () => import("@shikijs/langs/c"),
	java: () => import("@shikijs/langs/java"),
	kotlin: () => import("@shikijs/langs/kotlin"),
	swift: () => import("@shikijs/langs/swift"),
	sql: () => import("@shikijs/langs/sql"),
	xml: () => import("@shikijs/langs/xml"),
	dockerfile: () => import("@shikijs/langs/dockerfile"),
	diff: () => import("@shikijs/langs/diff"),
	graphql: () => import("@shikijs/langs/graphql"),
	toml: () => import("@shikijs/langs/toml"),
	ini: () => import("@shikijs/langs/ini"),
	regex: () => import("@shikijs/langs/regex"),
	powershell: () => import("@shikijs/langs/powershell"),
	dart: () => import("@shikijs/langs/dart"),
	lua: () => import("@shikijs/langs/lua"),
	perl: () => import("@shikijs/langs/perl"),
	r: () => import("@shikijs/langs/r")
}

let highlighterPromise: Promise<Highlighter> | null = null
const loadedLangs = new Set<string>()

async function getHighlighter(): Promise<Highlighter> {
	if (!highlighterPromise) {
		highlighterPromise = (async () => {
			const [{ createHighlighterCore }, { createJavaScriptRegexEngine }, light, dark] =
				await Promise.all([
					import("shiki/core"),
					import("shiki/engine/javascript"),
					import("@shikijs/themes/github-light"),
					import("@shikijs/themes/github-dark")
				])
			return createHighlighterCore({
				themes: [light.default, dark.default],
				engine: createJavaScriptRegexEngine(),
				langs: []
			})
		})()
	}
	return highlighterPromise
}

async function loadLanguage(
	highlighter: Highlighter,
	id: string,
	load: LanguageLoader
): Promise<void> {
	if (loadedLangs.has(id)) return
	await highlighter.loadLanguage((await load()).default)
	loadedLangs.add(id)
}

const resolvedCache = new Map<string, string>()
const pendingCache = new Map<string, Promise<string>>()

function cacheKey(code: string, lang: string): string {
	return `${lang}\u0001${code}`
}

export function getCachedHtml(code: string, lang: string): string | undefined {
	const key = cacheKey(code, lang)
	const hit = resolvedCache.get(key)
	if (hit) return hit
	const stored = readStorage(key)
	if (stored) {
		resolvedCache.set(key, stored)
		return stored
	}
	return undefined
}

export function highlightCodeCached(code: string, lang: string): Promise<string> {
	const cached = getCachedHtml(code, lang)
	if (cached) return Promise.resolve(cached)
	const key = cacheKey(code, lang)
	let pending = pendingCache.get(key)
	if (!pending) {
		pending = highlightCode(code, lang)
			.then((html) => {
				resolvedCache.set(key, html)
				writeStorage(key, html)
				return html
			})
			.catch((error) => {
				pendingCache.delete(key)
				throw error
			})
		pendingCache.set(key, pending)
	}
	return pending
}

const STORAGE_PREFIX = "code-block:v2:"
const STORAGE_INDEX = `${STORAGE_PREFIX}_index`
const MAX_ENTRIES = 60
const MAX_ENTRY_LENGTH = 200_000

function safeStorage(): Storage | null {
	try {
		if (typeof localStorage === "undefined") return null
		localStorage.length
		return localStorage
	} catch {
		return null
	}
}

function readStorage(key: string): string | undefined {
	const storage = safeStorage()
	if (!storage) return undefined
	try {
		return storage.getItem(STORAGE_PREFIX + hash(key)) ?? undefined
	} catch {
		return undefined
	}
}

function writeStorage(key: string, html: string): void {
	if (html.length > MAX_ENTRY_LENGTH) return
	const storage = safeStorage()
	if (!storage) return
	try {
		const storageKey = STORAGE_PREFIX + hash(key)
		storage.setItem(storageKey, html)
		const index = JSON.parse(storage.getItem(STORAGE_INDEX) ?? "[]") as string[]
		const existing = index.indexOf(storageKey)
		if (existing !== -1) index.splice(existing, 1)
		index.unshift(storageKey)
		while (index.length > MAX_ENTRIES) {
			storage.removeItem(index.pop()!)
		}
		storage.setItem(STORAGE_INDEX, JSON.stringify(index))
	} catch {}
}

function hash(input: string): string {
	let h = 0x811c9dc5
	for (let i = 0; i < input.length; i++) {
		h ^= input.charCodeAt(i)
		h = Math.imul(h, 0x01000193) >>> 0
	}
	return h.toString(36)
}
