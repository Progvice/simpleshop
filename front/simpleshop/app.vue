<template>
    <Header/>
    <div class="main">
      <NuxtPage />
    </div>
    <Footer/>
</template>

<style>

.main {
  margin-top: var(--header-height);
  display: flex;
  width: 100%;
  min-height: calc(100vh - var(--header-height));
  flex-direction: column;
}

</style>

