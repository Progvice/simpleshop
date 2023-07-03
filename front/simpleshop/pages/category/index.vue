<template>
    <h1>Categories</h1>
        <div class="categoryContainer">
            <div class="category" v-for="category in categories">
                <CategoriesBox :category="category"></CategoriesBox>
            </div>
        </div>
</template>

<script setup>
    useHead({
        title: 'Kategoriat - Simple Shop'
    });
    const {data: c} = await useFetch('/api/category', {
        method: 'GET',
        credentials: 'include'
    });
    const categories =  c._rawValue.data;
</script>

<style>
    .categoryContainer {
        width: calc(100% - 20px);
        padding: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
</style>