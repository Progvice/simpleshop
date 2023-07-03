<template>
    <div class="createCategory">
        <form>
            <input type="text" v-model="category" placeholder="Kategorian nimi"/>
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
    if(res._rawValue.status) {
        await navigateTo('/category');
    }
}

</script>

<style>
    .createCategory {
        width: 300px;
        max-width: calc(100% - 50px);
        padding: 25px;
        margin: auto;
        background-color: var(--header-bg);
    }
    .createCategory form {
        display: flex;
        flex-direction: column;
    }
    .createCategory form input {
        width: calc(100% - 23px);
        padding: 0 10px;
        margin-bottom: 10px;
    }

</style>