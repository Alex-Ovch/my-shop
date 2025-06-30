// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Подключаем модули
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxt/icon", "@nuxt/image"],

  // Настройки для работы с переменными окружения
  runtimeConfig: {
    // Приватные переменные (только на сервере)
    jwtSecret: process.env.JWT_SECRET,

    // Публичные переменные (доступны на клиенте)
    public: {
      appName: "My Shop",
    },
  },

  // Настройки CSS
  css: ["~/assets/css/main.css"],
});
