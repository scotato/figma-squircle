<script>
  import { Icon } from "figma-plugin-ds-svelte";

  export let id = null;
  export let value = null;
  export let name = null;
  export let iconText = null;
  export let borders = false;
  export let disabled = false;
  export let iconName = null;
  export let spin = false;
  export let min = null;
  export let max = null;
  export let step = null;
  export let onkeypress = () => {};
  export let onkeydown = () => {};
  export let onkeyup = () => {};
  export let onchange = () => {};
  export let placeholder = "";
  export { className as class };

  let className = "";
</script>

<style>
  .input {
    position: relative;
  }

  input {
    font-size: var(--font-size-xsmall);
    font-weight: var(--font-weight-normal);
    letter-spacing: var(--font-letter-spacing-neg-xsmall);
    line-height: var(--line-height);
    position: relative;
    display: flex;
    overflow: visible;
    align-items: center;
    width: 100%;
    height: 30px;
    margin: 1px 0 1px 0;
    padding: var(--size-xxsmall) var(--size-xxxsmall) var(--size-xxsmall)
      var(--size-xxsmall);
    color: var(--black8);
    border: 1px solid transparent;
    border-radius: var(--border-radius-small);
    outline: none;
    background-color: var(--white);
  }
  input:hover,
  input:placeholder-shown:hover {
    color: var(--black8);
    border: 1px solid var(--black1);
    background-image: none;
  }
  input::selection {
    color: var(--black);
    background-color: var(--blue3);
  }
  input::placeholder {
    color: var(--black3);
    border: 1px solid transparent;
  }
  input:placeholder-shown {
    color: var(--black8);
    border: 1px solid var(--black1);
    background-image: none;
  }
  input:focus:placeholder-shown {
    border: 1px solid var(--blue);
    outline: 1px solid var(--blue);
    outline-offset: -2px;
  }
  input:disabled:hover {
    border: 1px solid transparent;
  }
  input:active,
  input:focus {
    color: var(--black);
    border: 1px solid var(--blue);
    outline: 1px solid var(--blue);
    outline-offset: -2px;
  }
  input:disabled {
    position: relative;
    color: var(--black3);
    background-image: none;
  }
  input:disabled:active {
    outline: none;
  }

  .borders {
    border: 1px solid var(--black1);
    background-image: none;
  }
  .borders:disabled {
    border: 1px solid transparent;
    background-image: none;
  }
  .borders:disabled:placeholder-shown {
    border: 1px solid transparent;
    background-image: none;
  }
  .borders:disabled:placeholder-shown:active {
    border: 1px solid transparent;
    outline: none;
  }
  .borders:placeholder-shown {
    border: 1px solid var(--black1);
    background-image: none;
  }

  .indent {
    padding-left: 32px;
  }

  .icon {
    position: absolute;
    top: -1px;
    left: 0;
    width: var(--size-medium);
    height: var(--size-medium);
    z-index: 1;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>

{#if iconName || iconText}
  <div class="input {className}">
    <div class="icon">
      <Icon {iconName} {iconText} {spin} color="black3" />
    </div>
    <input
      type="number"
      bind:value
      {id}
      {name}
      {disabled}
      {placeholder}
      {min}
      {max}
      {step}
      on:keypress={onkeypress}
      on:keydown={onkeydown}
      on:keyup={onkeyup}
      on:change={onchange}
      onclick="this.select()"
      class="indent"
      class:borders />
  </div>
{:else}
  <div class="input {className}">
    <input
      type="number"
      bind:value
      {id}
      {name}
      {disabled}
      {placeholder}
      {min}
      {max}
      {step}
      on:keypress={onkeypress}
      on:keydown={onkeydown}
      on:keyup={onkeyup}
      on:change={onchange}
      onclick="this.select()"
      class:borders />
  </div>
{/if}
