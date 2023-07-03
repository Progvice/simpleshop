<template>
    <div class="categoryImg">
        <img src="/img/default_product.jpg"/>
    </div>
    <NuxtLink :to="`/category/${category.category_url}`">{{ category.category_name }}</NuxtLink>
</template>

<script setup>
    const { category } = defineProps(['category']);
</script>

<style>
    .category {
        width: calc(16.66666% - 22px);
        border: 1px solid rgb(161, 161, 161);
        margin: 10px;
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        z-index: 3;
        padding-bottom: 50px;
    }
    .category:hover {
        cursor: pointer;
    }
    .category:hover img {
        transform: scale(1.25);
    }
    .category .categoryImg {
        width: 100%;
        z-index: 2;
        position: relative;
        overflow: hidden;
    }
    .category img {
        width: 100%;
        transition: .25s ease;
    }
    .category a {
        display: flex;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        margin-bottom: 20px;
        text-decoration: none;
        color: var(--blue-color);
        align-items: flex-end;
        justify-content: center;
        z-index: 4;
        font-size: 1.3em;
    }
    @media all and (max-width: 1000px) {
        .category {
            width: calc(25% - 22px);
        }
    }
    @media all and (max-width: 750px) {
        .category {
            width: calc(50% - 22px);
        }
    }
</style>