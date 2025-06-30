<template>
  <div class="card hover:shadow-lg transition-shadow duration-300">
    <!-- Изображение товара -->
    <div class="relative">
      <NuxtImg
        :src="
          product.imageUrl ||
          `https://picsum.photos/400/300?random=${product.id}`
        "
        :alt="product.name"
        class="w-full h-48 object-contain"
        loading="lazy"
      />

      <!-- Бейдж "Нет в наличии" -->
      <div
        v-if="!product.inStock"
        class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium"
      >
        Нет в наличии
      </div>
    </div>

    <!-- Информация о товаре -->
    <div class="p-4">
      <!-- Название -->
      <h3 class="font-semibold text-lg mb-2 line-clamp-2">
        {{ product.name }}
      </h3>

      <!-- Описание -->
      <p class="text-gray-600 text-sm mb-3 line-clamp-3">
        {{ product.description }}
      </p>

      <!-- Цена и кнопки -->
      <div class="flex items-center justify-between">
        <!-- Цена -->
        <div class="flex items-center">
          <span class="text-2xl font-bold text-blue-600">
            ${{ product.price }}
          </span>
        </div>

        <!-- Кнопки -->
        <div class="flex gap-2">
          <!-- Кнопка "Подробнее" -->
          <NuxtLink
            :to="`/products/${product.id}`"
            class="btn-secondary text-sm"
          >
            <Icon name="mdi:eye" class="w-4 h-4 mr-1" />
            Подробнее
          </NuxtLink>

          <!-- Кнопка "В корзину" -->
          <button
            @click="addToCart"
            :disabled="!product.inStock"
            :class="[
              'btn-primary text-sm',
              !product.inStock && 'opacity-50 cursor-not-allowed',
            ]"
          >
            <Icon name="mdi:cart-plus" class="w-4 h-4 mr-1" />
            В корзину
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Типы для товара
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  inStock: boolean;
}

// Пропсы компонента
interface Props {
  product: Product;
}

const props = defineProps<Props>();

// Функция добавления в корзину (пока заглушка)
const addToCart = () => {
  console.log("Добавляем товар в корзину:", props.product.name);

  // Показываем уведомление (временно через alert)
  alert(`Товар "${props.product.name}" добавлен в корзину!`);

  // TODO: Позже здесь будет реальная логика добавления в корзину
};
</script>

<style scoped>
/* Ограничение количества строк текста */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
