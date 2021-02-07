<script>
	//import Global CSS from the svelte boilerplate
	//contains Figma color vars, spacing vars, utility classes and more
	import { GlobalCSS } from "figma-plugin-ds-svelte";

	//import some Svelte Figma UI components
	import {
		Button,
		// IconButton,
		Label,
		IconCornerRadius,
		// IconLinkBroken,
		// IconLinkConnected,
	} from "figma-plugin-ds-svelte";
	import Input from "./Input.svelte";

	$: width = 100;
	$: height = 100;
	$: curvature = 1;
	$: isLinked = false;
	$: isShiftDown = false;

	// const toggleSquare = () => (isLinked = !isLinked);

	onmessage = (event) => {
		console.log("got this from the plugin code", event.data.pluginMessage);
	};

	function onKeyUp({ key }) {
		switch (key) {
			case "Shift":
				isShiftDown = false;
				break;
			case "ArrowUp":
			case "ArrowDown":
				this.select();
			default:
				break;
		}
	}

	function onWidthKeyDown(event) {
		const increment = isShiftDown ? 10 : 1;

		switch (event.key) {
			case "Shift":
				isShiftDown = true;
				break;
			case "ArrowUp":
				event.preventDefault();
				width += increment;
				if (isLinked) height = (height * height) / width;
				resize();
				break;
			case "ArrowDown":
				event.preventDefault();
				width -= increment;
				if (isLinked) height = (height * height) / width;
				resize();
				break;
			default:
				break;
		}
	}

	function onHeightKeyDown(event) {
		const increment = isShiftDown ? 10 : 1;

		switch (event.key) {
			case "Shift":
				isShiftDown = true;
				break;
			case "ArrowUp":
				event.preventDefault();
				height += increment;
				resize();
				break;
			case "ArrowDown":
				event.preventDefault();
				height -= increment;
				resize();
				break;
			default:
				break;
		}
	}

	function onCurvatureChange(e) {
		const pluginMessage = { type: "update-squircle", curvature };
		parent.postMessage({ pluginMessage }, "*");
	}

	function resize() {
		const pluginMessage = { type: "resize", width, height };
		parent.postMessage({ pluginMessage }, "*");
	}

	// if square set W or H on W or H blur

	//this is a reactive variable that will return false when a value is selected from
	//the select menu, its value is bound to the primary buttons disabled prop
	// $: disabled = selectedShape === null;
</script>

<style>
	/* Add additional global or scoped styles here */
</style>

<div class="wrapper p-xxsmall">
	<div class="flex mb-xsmall">
		<Input
			iconText="W"
			bind:value={width}
			onkeydown={onWidthKeyDown}
			onkeyup={onKeyUp}
			min={1} />
		<Input
			iconText="H"
			bind:value={height}
			onkeydown={onHeightKeyDown}
			onkeyup={onKeyUp}
			min={1} />
		<!-- <IconButton
			on:click={toggleSquare}
			iconName={isLinked ? IconLinkConnected : IconLinkBroken} /> -->
	</div>

	<Input
		iconName={IconCornerRadius}
		bind:value={curvature}
		onchange={onCurvatureChange}
		class="mb-xxsmall"
		min={0.5}
		max={1}
		step={0.01} />
</div>
