<template>
    <div>
        <h1>Categories</h1>
        <div v-for="category in categories">
            <h1>{{ category.category_name }}</h1>
        </div>
    </div>
</template>

<script setup>
    const {data: c} = await useFetch('/api/category');
    const categories =  c._rawValue.data;
</script>

<style scoped>

</style>