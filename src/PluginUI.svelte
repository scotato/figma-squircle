<script>
	//import Global CSS from the svelte boilerplate
	//contains Figma color vars, spacing vars, utility classes and more
	import { GlobalCSS } from "figma-plugin-ds-svelte";

	//import some Svelte Figma UI components
	import {
		Button,
		Input,
		Label,
		IconCornerRadius,
	} from "figma-plugin-ds-svelte";

	let curvature = 1;

	//this is a reactive variable that will return false when a value is selected from
	//the select menu, its value is bound to the primary buttons disabled prop
	// $: disabled = selectedShape === null;

	// function createShapes() {
	// 	parent.postMessage(
	// 		{
	// 			pluginMessage: {
	// 				type: "create-shapes",
	// 				count: count,
	// 				shape: "Rectangle",
	// 			},
	// 		},
	// 		"*"
	// 	);
	// }

	function createSquircle() {
		const type = "create-squircle";
		const squircle = createSquirclePath({ curvature });
		const pluginMessage = { type, squircle };
		parent.postMessage({ pluginMessage }, "*");
	}

	function createSquirclePath({
		curvature = 1,
		width = 100,
		height = 100,
	} = {}) {
		const cx = width / 2;
		const cy = height / 2;
		const arc = Math.min(cx, cy) * (1 - curvature);
		const d = `
			M 0 ${cy}
			C 0 ${arc}, ${arc} 0, ${cx} 0
			S ${width} ${arc}, ${width} ${cy}, ${width - arc} ${height}
				${cx} ${height}, 0 ${height - arc}, 0 ${cy}
		`;

		return `<path id="Squircle" fill="#C4C4C4" d="${d}" />`;
	}
</script>

<style>
	/* Add additional global or scoped styles here */
</style>

<div class="wrapper p-xxsmall">
	<Label>Curvature</Label>
	<Input
		iconName={IconCornerRadius}
		bind:value={curvature}
		class="mb-xxsmall" />

	<div class="flex p-xxsmall mb-xsmall">
		<Button on:click={createSquircle}>Create shapes</Button>
	</div>
</div>
