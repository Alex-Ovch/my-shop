<template>
  <div class="container-custom py-8">
    <!-- Состояние загрузки -->
    <div v-if="pending" class="text-center py-12">
      <Icon
        name="mdi:loading"
        class="w-8 h-8 animate-spin text-blue-600 mx-auto"
      />
      <p class="mt-4 text-gray-600">Загружаем товар...</p>
    </div>

    <!-- Ошибка загрузки -->
    <div v-else-if="error" class="text-center py-12">
      <Icon name="mdi:alert-circle" class="w-12 h-12 text-red-500 mx-auto" />
      <h1 class="mt-4 text-2xl font-bold text-red-600">Товар не найден</h1>
      <p class="mt-2 text-gray-600">
        Возможно, товар был удален или ссылка неверна
      </p>
      <NuxtLink to="/products" class="btn-primary mt-4">
        <Icon name="mdi:arrow-left" class="w-4 h-4 mr-2" />
        Вернуться к каталогу
      </NuxtLink>
    </div>

    <!-- Детали товара -->
    <div v-else-if="product">
      <!-- Навигация -->
      <nav class="mb-6">
        <ol class="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <NuxtLink to="/" class="hover:text-blue-600">Главная</NuxtLink>
          </li>
          <li>/</li>
          <li>
            <NuxtLink to="/products" class="hover:text-blue-600"
              >Товары</NuxtLink
            >
          </li>
          <li>/</li>
          <li class="text-gray-900">{{ product.name }}</li>
        </ol>
      </nav>

      <!-- Основная информация о товаре -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Изображение -->
        <div class="space-y-4">
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <NuxtImg
              :src="
                product.imageUrl ||
                `https://picsum.photos/600/400?random=${product.id}`
              "
              :alt="product.name"
              class="w-full h-96 object-cover"
            />
          </div>

          <!-- Дополнительная информация -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-2">Информация о товаре</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Артикул:</span>
                <span class="font-mono">{{
                  product.id.slice(-8).toUpperCase()
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Наличие:</span>
                <span
                  :class="product.inStock ? 'text-green-600' : 'text-red-600'"
                >
                  {{ product.inStock ? "В наличии" : "Нет в наличии" }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Добавлен:</span>
                <span>{{ formatDate(product.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Информация и действия -->
        <div class="space-y-6">
          <!-- Заголовок и цена -->
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-4">
              {{ product.name }}
            </h1>
            <div class="flex items-center space-x-4 mb-4">
              <span class="text-4xl font-bold text-blue-600"
                >${{ product.price }}</span
              >
              <div
                v-if="!product.inStock"
                class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                Нет в наличии
              </div>
            </div>
          </div>

          <!-- Описание -->
          <div>
            <h2 class="text-xl font-semibold mb-3">Описание</h2>
            <p class="text-gray-700 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <!-- Количество и действия -->
          <div class="space-y-4">
            <!-- Количество -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Количество
              </label>
              <div class="flex items-center space-x-3">
                <button
                  @click="decreaseQuantity"
                  :disabled="quantity <= 1"
                  class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                >
                  <Icon name="mdi:minus" class="w-4 h-4" />
                </button>
                <input
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  max="10"
                  class="w-20 text-center border border-gray-300 rounded-lg py-2"
                />
                <button
                  @click="increaseQuantity"
                  :disabled="quantity >= 10"
                  class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                >
                  <Icon name="mdi:plus" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Кнопки действий -->
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="addToCart"
                :disabled="!product.inStock"
                :class="[
                  'flex-1 btn-primary text-lg py-3 flex items-center justify-center',
                  !product.inStock && 'opacity-50 cursor-not-allowed',
                ]"
              >
                <Icon name="mdi:cart-plus" class="w-5 h-5 mr-2" />
                Добавить в корзину
              </button>

              <button
                class="btn-secondary text-lg py-3 flex items-center justify-center"
              >
                <Icon name="mdi:heart-outline" class="w-5 h-5 mr-2" />
                В избранное
              </button>
            </div>

            <!-- Итоговая стоимость -->
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="flex justify-between items-center">
                <span class="text-lg font-medium">Итого:</span>
                <span class="text-2xl font-bold text-blue-600">
                  ${{ (product.price * quantity).toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Дополнительная информация -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Доставка -->
          <div class="text-center">
            <div
              class="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <Icon name="mdi:truck-fast" class="w-6 h-6 text-blue-600" />
            </div>
            <h3 class="font-semibold mb-1">Быстрая доставка</h3>
            <p class="text-sm text-gray-600">Доставим в течение 1-3 дней</p>
          </div>

          <!-- Гарантия -->
          <div class="text-center">
            <div
              class="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <Icon name="mdi:shield-check" class="w-6 h-6 text-green-600" />
            </div>
            <h3 class="font-semibold mb-1">Гарантия качества</h3>
            <p class="text-sm text-gray-600">30 дней на возврат</p>
          </div>

          <!-- Поддержка -->
          <div class="text-center">
            <div
              class="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <Icon name="mdi:headset" class="w-6 h-6 text-purple-600" />
            </div>
            <h3 class="font-semibold mb-1">Поддержка</h3>
            <p class="text-sm text-gray-600">Помощь 24/7</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Получаем ID товара из URL
const route = useRoute();
const productId = route.params.id;

// Количество товара
const quantity = ref(1);

// Загружаем товар с сервера
const {
  data: productData,
  pending,
  error,
} = await useFetch(`/api/products/${productId}`);

// Извлекаем товар из ответа
const product = computed(() => {
  return productData.value?.data;
});

// Функции для управления количеством
const increaseQuantity = () => {
  if (quantity.value < 10) quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

// Добавление в корзину
const addToCart = () => {
  console.log("Добавляем в корзину:", {
    product: product.value,
    quantity: quantity.value,
  });

  alert(`Добавлено в корзину: ${product.value.name} (${quantity.value} шт.)`);

  // TODO: Реальная логика добавления в корзину
};

// Форматирование даты
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ru-RU");
};

// Настройки страницы
useHead({
  title: computed(() =>
    product.value ? `${product.value.name} - My Shop` : "Товар - My Shop"
  ),
  meta: [
    {
      name: "description",
      content: computed(() => product.value?.description || "Описание товара"),
    },
  ],
});

// Если товар не найден, возвращаем 404
if (error.value?.statusCode === 404) {
  throw createError({
    statusCode: 404,
    statusMessage: "Товар не найден",
  });
}
</script>
