<template>
    <header>
        <h1><NuxtLink to="/">Verkkokauppa</NuxtLink></h1>
        <nav>
            <ul>
                <li><NuxtLink to="/">Home</NuxtLink></li>
                <li><NuxtLink to="/about">About</NuxtLink></li>
                <li><NuxtLink to="/login">Login</NuxtLink></li>
                <li><NuxtLink to="/category/create">Luo kategoria</NuxtLink></li>
                <li><NuxtLink to="/category">Kategoriat</NuxtLink></li>
            </ul>
        </nav>
    </header>
</template>

<script>
export default {
    name: 'Header'
}
</script>

<style>
    header {
        position: fixed;
        top: 0;
        left:0;
        width: calc(100% - 40px);
        padding: 0 20px;
        height: var(--header-height);
        background-color: var(--header-bg);
        z-index: 9999;
        display: flex;
        align-items:center;
        justify-content: space-between;
    }
    header h1 a {
        color: var(--blue-color);
    }
    header nav {
        position: relative;
        display: flex;
        height: var(--header-height)
    }
    header nav ul {
        list-style: none;
        display: inline-flex;
        margin: 0;
        padding:0;
        height: var(--header-height);
    }
    header nav ul li {
        height: var(--header-height);
        display: flex;
    }
    header nav ul li a {
        color: white;
        text-decoration: none;
        padding:0 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    header nav ul li a:hover {
        background-color: var(--blue-color);
    }

</style>