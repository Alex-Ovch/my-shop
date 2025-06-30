<template>
  <div class="container-custom py-8">
    <!-- Заголовок страницы -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Каталог товаров</h1>
      <p class="text-gray-600">Найдите то, что вам нужно</p>
    </div>

    <!-- Поиск и фильтры -->
    <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Поиск -->
        <div class="flex-1">
          <div class="relative">
            <Icon
              name="mdi:magnify"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск товаров..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Сортировка -->
        <div class="lg:w-64">
          <select
            v-model="sortBy"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">Сначала новые</option>
            <option value="price-low">Цена: по возрастанию</option>
            <option value="price-high">Цена: по убыванию</option>
            <option value="name">По названию</option>
          </select>
        </div>

        <!-- Показать только в наличии -->
        <div class="flex items-center">
          <label class="flex items-center cursor-pointer">
            <input
              v-model="showOnlyInStock"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Только в наличии</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Состояние загрузки -->
    <div v-if="pending" class="text-center py-12">
      <Icon
        name="mdi:loading"
        class="w-8 h-8 animate-spin text-blue-600 mx-auto"
      />
      <p class="mt-4 text-gray-600">Загружаем товары...</p>
    </div>

    <!-- Ошибка загрузки -->
    <div v-else-if="error" class="text-center py-12">
      <Icon name="mdi:alert-circle" class="w-12 h-12 text-red-500 mx-auto" />
      <h2 class="mt-4 text-xl font-semibold text-red-600">Ошибка загрузки</h2>
      <p class="mt-2 text-gray-600">Не удалось загрузить товары</p>
      <button @click="refresh()" class="btn-primary mt-4">
        Попробовать снова
      </button>
    </div>

    <!-- Результаты -->
    <div v-else>
      <!-- Информация о результатах -->
      <div class="flex items-center justify-between mb-6">
        <p class="text-gray-600">
          Найдено товаров:
          <span class="font-semibold">{{ filteredProducts.length }}</span>
        </p>

        <!-- Переключение вида (пока только сетка) -->
        <div class="flex items-center space-x-2">
          <button class="p-2 bg-blue-600 text-white rounded">
            <Icon name="mdi:view-grid" class="w-5 h-5" />
          </button>
          <button class="p-2 text-gray-400 hover:text-gray-600">
            <Icon name="mdi:view-list" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Сетка товаров -->
      <div
        v-if="filteredProducts.length"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      >
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Нет результатов -->
      <div v-else class="text-center py-12">
        <Icon
          name="mdi:package-variant-closed"
          class="w-16 h-16 text-gray-400 mx-auto"
        />
        <h2 class="mt-4 text-xl font-semibold text-gray-600">
          Товары не найдены
        </h2>
        <p class="mt-2 text-gray-500">Попробуйте изменить параметры поиска</p>
        <button @click="clearFilters" class="btn-secondary mt-4">
          Сбросить фильтры
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Реактивные переменные для фильтрации
const searchQuery = ref("");
const sortBy = ref("newest");
const showOnlyInStock = ref(false);

// Загружаем товары с сервера
const {
  data: productsData,
  pending,
  error,
  refresh,
} = await useFetch("/api/products");

// Извлекаем массив товаров
const products = computed(() => {
  return productsData.value?.data || [];
});

// Фильтрованные и отсортированные товары
const filteredProducts = computed(() => {
  let result = [...products.value];

  // Фильтр по поиску
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }

  // Фильтр "только в наличии"
  if (showOnlyInStock.value) {
    result = result.filter((product) => product.inStock);
  }

  // Сортировка
  switch (sortBy.value) {
    case "price-low":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      result.sort((a, b) => b.price - a.price);
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
    default:
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
  }

  return result;
});

// Сброс всех фильтров
const clearFilters = () => {
  searchQuery.value = "";
  sortBy.value = "newest";
  showOnlyInStock.value = false;
};

// Настройки страницы
useHead({
  title: "Каталог товаров - My Shop",
  meta: [
    {
      name: "description",
      content: "Полный каталог товаров интернет-магазина My Shop",
    },
  ],
});
</script>
