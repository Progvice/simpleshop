<template>
    <button>
        <slot />
    </button>
</template>

<style>

button {
    background-color: transparent;
    border: 2px solid var(--blue-color);
    color: var(--blue-color);
    padding: 10px;
    font-size: 1.2em;
    transition: .3s ease;
    cursor: pointer;
}
button:hover {
    background-color: var(--blue-color);
    border: 2px solid var(--blue-color);
    color: white;
}

</style>