<template>
    <div>
        <form>
            <input type="text" v-model="category"/>
            <Button @click="createCategory">Luo kategoria</Button>
        </form>
    </div>
</template>

<script setup>

useHead({
    title: 'Create Category - Simple Shop'
});

const category = ref('');

const createCategory = async (e) => {
    e.preventDefault();
    const {data : res} = await useFetch('/api/category/create', {
        method: 'POST',
        credentials: 'include',
        body: {
            name: category
        }
    });
    console.log(res);
}

</script>

<style scoped>

</style>