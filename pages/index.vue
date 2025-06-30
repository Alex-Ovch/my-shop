<template>
  <div>
    <!-- Героический блок -->
    <section class="bg-blue-600 text-white py-20">
      <div class="container-custom text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          Добро пожаловать в My Shop
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-blue-100">
          Лучшие товары по отличным ценам
        </p>
        <NuxtLink
          to="/products"
          class="btn-primary bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
        >
          <Icon name="mdi:shopping" class="w-5 h-5 mr-2" />
          Смотреть товары
        </NuxtLink>
      </div>
    </section>

    <!-- Популярные товары -->
    <section class="py-16">
      <div class="container-custom">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Популярные товары
          </h2>
          <p class="text-gray-600 text-lg">
            Самые продаваемые товары в нашем магазине
          </p>
        </div>

        <!-- Состояние загрузки -->
        <div v-if="pending" class="text-center py-8">
          <Icon name="mdi:loading" class="w-8 h-8 animate-spin text-blue-600" />
          <p class="mt-2 text-gray-600">Загружаем товары...</p>
        </div>

        <!-- Ошибка загрузки -->
        <div v-else-if="error" class="text-center py-8">
          <Icon name="mdi:alert-circle" class="w-8 h-8 text-red-500 mx-auto" />
          <p class="mt-2 text-red-600">Ошибка загрузки товаров</p>
          <button @click="refresh()" class="btn-primary mt-4">
            Попробовать снова
          </button>
        </div>

        <!-- Сетка товаров -->
        <div
          v-else-if="products?.length"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <ProductCard
            v-for="product in products.slice(0, 4)"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- Нет товаров -->
        <div v-else class="text-center py-8">
          <Icon
            name="mdi:package-variant"
            class="w-16 h-16 text-gray-400 mx-auto"
          />
          <p class="mt-4 text-gray-600 text-lg">Товары пока не добавлены</p>
        </div>

        <!-- Кнопка "Смотреть все" -->
        <div v-if="products?.length" class="text-center mt-12">
          <NuxtLink to="/products" class="btn-primary text-lg px-8 py-3">
            Смотреть все товары
            <Icon name="mdi:arrow-right" class="w-5 h-5 ml-2" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Преимущества -->
    <section class="bg-gray-100 py-16">
      <div class="container-custom">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Почему выбирают нас?
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Быстрая доставка -->
          <div class="text-center">
            <div
              class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Icon name="mdi:truck-fast" class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Быстрая доставка</h3>
            <p class="text-gray-600">Доставим ваш заказ в кратчайшие сроки</p>
          </div>

          <!-- Качество -->
          <div class="text-center">
            <div
              class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Icon name="mdi:shield-check" class="w-8 h-8 text-green-600" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Гарантия качества</h3>
            <p class="text-gray-600">
              Только проверенные товары высокого качества
            </p>
          </div>

          <!-- Поддержка -->
          <div class="text-center">
            <div
              class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Icon name="mdi:headset" class="w-8 h-8 text-purple-600" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Поддержка 24/7</h3>
            <p class="text-gray-600">
              Всегда готовы помочь и ответить на вопросы
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Загружаем товары с сервера
const {
  data: productsData,
  pending,
  error,
  refresh,
} = await useFetch("/api/products");

// Извлекаем массив товаров из ответа API
const products = computed(() => {
  return productsData.value?.data || [];
});

// Настройки страницы
useHead({
  title: "My Shop - Главная страница",
  meta: [
    {
      name: "description",
      content: "Интернет-магазин с лучшими товарами по доступным ценам",
    },
  ],
});
</script>
