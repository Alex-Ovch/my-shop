<template>
  <div>
    <!-- Хедер -->
    <header class="bg-white shadow-sm border-b">
      <nav class="container-custom py-4">
        <div class="flex items-center justify-between">
          <!-- Лого -->
          <NuxtLink to="/" class="flex items-center space-x-2">
            <Icon name="mdi:shopping" class="w-8 h-8 text-blue-600" />
            <span class="text-xl font-bold text-gray-900">My Shop</span>
          </NuxtLink>

          <!-- Навигация -->
          <div class="flex items-center space-x-6">
            <NuxtLink
              to="/"
              class="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Главная
            </NuxtLink>
            <NuxtLink
              to="/products"
              class="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Товары
            </NuxtLink>

            <!-- Если пользователь авторизован -->
            <template v-if="authStore.isAuthenticated">
              <!-- Корзина -->
              <button
                class="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Icon name="mdi:cart" class="w-6 h-6" />
                <!-- Счетчик товаров в корзине -->
                <span
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  0
                </span>
              </button>

              <!-- Меню пользователя -->
              <div class="relative group">
                <button
                  class="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Icon name="mdi:account-circle" class="w-6 h-6" />
                  <span class="hidden sm:block">{{
                    authStore.user?.name
                  }}</span>
                  <Icon name="mdi:chevron-down" class="w-4 h-4" />
                </button>

                <!-- Выпадающее меню -->
                <div
                  class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                >
                  <NuxtLink
                    to="/profile"
                    class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <Icon name="mdi:account" class="w-4 h-4 mr-3" />
                    Личный кабинет
                  </NuxtLink>
                  <NuxtLink
                    to="/orders"
                    class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <Icon name="mdi:package-variant" class="w-4 h-4 mr-3" />
                    Мои заказы
                  </NuxtLink>
                  <hr class="my-2" />
                  <button
                    @click="authStore.logout()"
                    class="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    <Icon name="mdi:logout" class="w-4 h-4 mr-3" />
                    Выйти
                  </button>
                </div>
              </div>
            </template>

            <!-- Если пользователь НЕ авторизован -->
            <template v-else>
              <NuxtLink
                to="/login"
                class="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Войти
              </NuxtLink>
              <NuxtLink to="/register" class="btn-primary">
                <Icon name="mdi:account-plus" class="w-4 h-4 mr-2" />
                Регистрация
              </NuxtLink>
            </template>
          </div>
        </div>
      </nav>
    </header>

    <!-- Основной контент -->
    <main class="min-h-screen">
      <NuxtPage />
    </main>

    <!-- Футер -->
    <footer class="bg-gray-800 text-white py-8 mt-12">
      <div class="container-custom">
        <div class="text-center">
          <p>&copy; 2024 My Shop. Все права защищены.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Используем auth store
const authStore = useAuthStore();

// Инициализируем авторизацию при загрузке
onMounted(async () => {
  await authStore.initialize();
});

// Настройки головы документа
useHead({
  title: "My Shop - Интернет-магазин",
  meta: [
    {
      name: "description",
      content: "Лучший интернет-магазин с широким ассортиментом товаров",
    },
  ],
});
</script>
