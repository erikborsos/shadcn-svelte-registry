<script lang="ts" module>
	export const title = "Demo"
	export const description = "Single file and multi file code blocks with tabs and copy button."
</script>

<script lang="ts">
	import { CodeBlock } from "../index.ts"
</script>

<div class="flex w-full max-w-xl flex-col gap-4">
	<CodeBlock
		files={[
			{
				name: "index.ts",
				lang: "typescript",
				code: `import { greet } from "./greet.js"\n\nconsole.log(greet("world"))`
			},
			{
				name: "greet.ts",
				lang: "typescript",
				code: `export function greet(name: string): string {\n\treturn \`Hello, \${name}!\`\n}`
			}
		]}
	/>
</div>
