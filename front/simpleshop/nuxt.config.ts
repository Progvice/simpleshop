// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Simple Shop',
      meta: [
        {
          name: 'description',
          content: 'Simple Shop is application that is easy to use'
        }
      ]
    }
  },
  css: ['~/assets/css/fonts.css', '~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiHost: 'localhost'
    }
  },
  devtools: { enabled: true }
})
