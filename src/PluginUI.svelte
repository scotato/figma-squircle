<script>
	import { GlobalCSS } from "figma-plugin-ds-svelte";

	import {
		Icon,
		IconAdjust,
		IconCornerRadius,
		SelectMenu,
	} from "figma-plugin-ds-svelte";
	import Input from "./Input.svelte";

	const SIMPLE = "simple";
	const FIXED = "fixed";
	const RELATIVE = "relative";

	let modeOptions = [
		{ value: SIMPLE, label: "Simple", group: null, selected: false },
		{ value: FIXED, label: "Fixed", group: null, selected: false },
		{ value: RELATIVE, label: "Relative", group: null, selected: false },
	];

	$: width = 100;
	$: height = 100;
	$: c = 5;
	$: r1 = 0.059;
	$: r2 = 0.332;
	$: p1 = 16;
	$: p2 = 16;
	$: mode = modeOptions[0];
	$: isShiftDown = false;
	$: isSizeDisabled = false;
	$: isModeDisabled = false;
	$: isCurvatureDisabled = false;
	$: isFixed1Disabled = false;
	$: isFixed2Disabled = false;
	$: isRelative1Disabled = false;
	$: isRelative2Disabled = false;

	const dedupByKey = (key, nodes) =>
		Array.from(new Set(nodes.map((node) => node[key])));

	const uniqueProps = (nodes = []) => ({
		widths: dedupByKey("width", nodes),
		heights: dedupByKey("height", nodes),
		modes: dedupByKey("mode", nodes),
		curvatures: dedupByKey("c", nodes),
		fixed1: dedupByKey("p1", nodes),
		fixed2: dedupByKey("p2", nodes),
		relative1: dedupByKey("r1", nodes),
		relative2: dedupByKey("r2", nodes),
	});

	onmessage = (event) => {
		const { type, nodes } = event.data.pluginMessage;
		switch (type) {
			case "init":
			case "selectionchange":
				const {
					widths,
					heights,
					modes,
					curvatures,
					fixed1,
					fixed2,
					relative1,
					relative2,
				} = uniqueProps(nodes);

				isSizeDisabled = widths.length !== 1 && heights.length !== 1;
				isModeDisabled = modes.length !== 1;
				isCurvatureDisabled = isModeDisabled || curvatures.length !== 1;
				isFixed1Disabled = isModeDisabled || fixed1.length !== 1;
				isFixed2Disabled = isModeDisabled || fixed2.length !== 1;
				isRelative1Disabled = isModeDisabled || relative1.length !== 1;
				isRelative2Disabled = isModeDisabled || relative2.length !== 1;

				if (!isSizeDisabled) {
					width = widths[0];
					height = heights[0];
				}

				if (!isModeDisabled) {
					mode = modeOptions.find((option) => option.value === modes[0]);
				}

				if (!isCurvatureDisabled) c = curvatures[0];
				if (!isFixed1Disabled) p1 = fixed1[0];
				if (!isFixed2Disabled) p2 = fixed2[0];
				if (!isRelative1Disabled) r1 = relative1[0];
				if (!isRelative2Disabled) r2 = relative2[0];
				break;
		}
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
		const min = 1;

		switch (event.key) {
			case "Shift":
				isShiftDown = true;
				break;
			case "ArrowUp":
				event.preventDefault();
				width = Number(width) + increment;
				resize();
				break;
			case "ArrowDown":
				event.preventDefault();
				width = Number(width) - increment;
				if (width <= min) width = min;
				resize();
				break;
			default:
				break;
		}
	}

	function onHeightKeyDown(event) {
		const increment = isShiftDown ? 10 : 1;
		const min = 1;

		switch (event.key) {
			case "Shift":
				isShiftDown = true;
				break;
			case "ArrowUp":
				event.preventDefault();
				height = Number(height) + increment;
				resize();
				break;
			case "ArrowDown":
				event.preventDefault();
				height = Number(height) - increment;
				if (height <= min) height = min;
				resize();
				break;
			default:
				break;
		}
	}

	function onCurvatureKeyDown(event) {
		const increment = 1;
		const max = 10;
		const min = 1;

		switch (event.key) {
			case "Shift":
				isShiftDown = true;
				break;
			case "ArrowUp":
				event.preventDefault();
				c = Number(c) + increment;
				if (c >= max) c = max;
				update();
				break;
			case "ArrowDown":
				event.preventDefault();
				c = Number(c) - increment;
				if (c <= min) c = min;
				update();
				break;
			default:
				break;
		}
	}

	function onP1KeyDown(event) {
		const increment = isShiftDown ? 10 : 1;
		const min = 1;

		switch (event.key) {
			case "Shift":
				isShiftDown = true;
				break;
			case "ArrowUp":
				event.preventDefault();
				p1 = Number(p1) + increment;
				update();
				break;
			case "ArrowDown":
				event.preventDefault();
				p1 = Number(p1) - increment;
				if (p1 <= min) p1 = min;
				update();
				break;
			default:
				break;
		}
	}

	function onP2KeyDown(event) {
		const increment = isShiftDown ? 10 : 1;
		const min = 1;

		switch (event.key) {
			case "Shift":
				isShiftDown = true;
				break;
			case "ArrowUp":
				event.preventDefault();
				p2 = Number(p2) + increment;
				update();
				break;
			case "ArrowDown":
				event.preventDefault();
				p2 = Number(p2) - increment;
				if (p2 <= min) p2 = min;
				update();
				break;
			default:
				break;
		}
	}

	const toFixed = (num, places = 3) => Number(num.toFixed(places));

	function onR1KeyDown(event) {
		const increment = isShiftDown ? 0.1 : 0.01;
		const max = 0.5;
		const min = 0;

		switch (event.key) {
			case "Shift":
				isShiftDown = true;
				break;
			case "ArrowUp":
				event.preventDefault();
				r1 = toFixed(Number(r1) + increment);
				if (r1 >= max) r1 = max;
				update();
				break;
			case "ArrowDown":
				event.preventDefault();
				r1 = toFixed(Number(r1) - increment);
				if (r1 <= min) r1 = min;
				update();
				break;
			default:
				break;
		}
	}

	function onR2KeyDown(event) {
		const increment = isShiftDown ? 0.1 : 0.01;
		const max = 0.5;
		const min = 0;

		switch (event.key) {
			case "Shift":
				isShiftDown = true;
				break;
			case "ArrowUp":
				event.preventDefault();
				r2 = toFixed(Number(r2) + increment);
				if (r2 >= max) r2 = max;
				update();
				break;
			case "ArrowDown":
				event.preventDefault();
				r2 = toFixed(Number(r2) - increment);
				if (r2 <= min) r2 = min;
				update();
				break;
			default:
				break;
		}
	}

	function resize() {
		const pluginMessage = { type: "resize", width, height };
		parent.postMessage({ pluginMessage }, "*");
	}

	function update() {
		const props = { mode: mode.value, c, p1, p2, r1, r2 };
		const pluginMessage = { type: "update-squircle", ...props };
		parent.postMessage({ pluginMessage }, "*");
	}
</script>

<style>
	input[type="range"] {
		margin: 0;
	}

	input[type="range"] {
		-webkit-appearance: none; /* Hides the slider so that custom slider can be made */
		background: transparent; /* Otherwise white in Chrome */
	}

	input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
	}

	input[type="range"]:focus {
		outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
	}

	input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		border: 1px solid #cccccc;
		height: 12px;
		width: 12px;
		border-radius: 6px;
		background: #ffffff;
		transform: scale(1.2);
		-webkit-transform-origin-y: 10px;
	}

	input[type="range"]::-webkit-slider-runnable-track {
		width: 100%;
		height: 12px;
		background: #f2f2f2;
		border-radius: 6px;
		border: 1px solid #cccccc;
	}
</style>

<div class="wrapper p-xxsmall">
	<SelectMenu
		bind:menuItems={modeOptions}
		bind:value={mode}
		on:change={update}
		disabled={isModeDisabled}
		iconName={IconAdjust}
		class="mb-xxxsmall" />

	<div class="flex mb-xxxsmall">
		<Input
			iconText="W"
			bind:value={width}
			disabled={isSizeDisabled}
			onkeydown={onWidthKeyDown}
			onkeyup={onKeyUp}
			min={1} />
		<Input
			iconText="H"
			bind:value={height}
			disabled={isSizeDisabled}
			onkeydown={onHeightKeyDown}
			onkeyup={onKeyUp}
			min={1} />
	</div>

	{#if mode.value === SIMPLE}
		<div class="flex mb-xxxsmall">
			<Icon iconName={IconCornerRadius} color="black3" />
			<input
				type="range"
				iconName={IconCornerRadius}
				bind:value={c}
				on:input={update}
				disabled={isCurvatureDisabled}
				min={1}
				max={10}
				step={1} />
			<Input
				bind:value={c}
				disabled={isCurvatureDisabled}
				onkeydown={onCurvatureKeyDown}
				onkeyup={onKeyUp}
				class="ml-xxsmall"
				min={1}
				max={10}
				step={1} />
		</div>
	{/if}

	{#if mode.value === FIXED}
		<div class="flex mb-xxxsmall">
			<Input
				iconText="p1"
				bind:value={p1}
				disabled={isFixed1Disabled}
				onkeydown={onP1KeyDown}
				onkeyup={onKeyUp}
				min={1} />
			<Input
				iconText="p2"
				bind:value={p2}
				disabled={isFixed2Disabled}
				onkeydown={onP2KeyDown}
				onkeyup={onKeyUp}
				min={1} />
		</div>
	{/if}

	{#if mode.value === RELATIVE}
		<div class="flex mb-xxxsmall">
			<Input
				iconText="r1"
				bind:value={r1}
				disabled={isRelative1Disabled}
				onkeydown={onR1KeyDown}
				onkeyup={onKeyUp}
				min={1} />
			<Input
				iconText="r2"
				bind:value={r2}
				disabled={isRelative2Disabled}
				onkeydown={onR2KeyDown}
				onkeyup={onKeyUp}
				min={1} />
		</div>
	{/if}
</div>
