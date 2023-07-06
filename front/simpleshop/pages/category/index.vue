<template>
    <h1>Categories</h1>
        <div class="categoryContainer" v-if="categories !== null">
            <div class="category" v-for="category in categories">
                <CategoriesBox :category="category"></CategoriesBox>
            </div>
        </div>
        <div class="categoryContainer" v-else>
            <h3>Kategorioita ei voitu ladata</h3>
        </div>
</template>

<script setup>
    useHead({
        title: 'Kategoriat - Simple Shop'
    });
    let categories;
    const {data: c} = await useFetch('/api/category', {
        method: 'GET',
        credentials: 'include'
    });
    if(c._rawValue.status) {
        categories = c._rawValue.data;
    }
    else {
        console.log(c._rawValue);
    }
    
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