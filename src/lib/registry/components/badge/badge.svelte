<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants"

	export const badgeVariants = tv({
		base: "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3",
		variants: {
			variant: {
				default: "border-transparent bg-primary text-primary-foreground",
				secondary: "border-transparent bg-secondary text-secondary-foreground",
				destructive: "border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20",
				outline: "text-foreground"
			}
		},
		defaultVariants: {
			variant: "default"
		}
	})

	export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]

	export type BadgeProps = {
		variant?: BadgeVariant
		class?: string
		ref?: HTMLSpanElement | null
		children?: import("svelte").Snippet
	}
</script>

<script lang="ts">
	import { cn } from "$lib/utils"

	let {
		variant = "default",
		class: className,
		ref = $bindable(null),
		children
	}: BadgeProps = $props()
</script>

<span bind:this={ref} data-slot="badge" class={cn(badgeVariants({ variant }), className)}>
	{@render children?.()}
</span>
