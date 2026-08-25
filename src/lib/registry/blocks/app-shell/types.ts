import type { Snippet } from "svelte"

export type NavLink = {
	label: string
	href: string
}

export type SidebarGroup = {
	label: string
	href?: string
	items?: {
		label: string
		href: string
	}[]
}

export type SearchConfig = {
	placeholder: string
	shortPlaceholder?: string
	onSearch: () => void
}

export type TocItem = {
	title: string
	url: string
	depth: number
}

export type AppShellProps = {
	children: Snippet
	/** Links rendered in the header. */
	nav?: NavLink[]
	/** Groups rendered in the sidebar. */
	sidebar?: SidebarGroup[]
	/** Header search button. Omit to hide it. */
	search?: SearchConfig
	/** GitHub repository URL. Omit to hide the icon. */
	github?: string
	/** Custom logo for the header home button. */
	logo?: Snippet
	/** Home URL used by the header logo button. Defaults to "/". */
	home?: string
	/** Show the "on this page" table of contents. Defaults to true. */
	toc?: boolean
}
