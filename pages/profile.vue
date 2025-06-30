<template>
  <div class="container-custom py-8">
    <!-- Если пользователь не авторизован -->
    <div v-if="!authStore.isAuthenticated" class="text-center py-12">
      <Icon
        name="mdi:account-alert"
        class="w-16 h-16 text-gray-400 mx-auto mb-4"
      />
      <h2 class="text-2xl font-bold text-gray-900 mb-2">
        Необходима авторизация
      </h2>
      <p class="text-gray-600 mb-6">
        Для доступа к личному кабинету необходимо войти в аккаунт
      </p>
      <div class="space-x-4">
        <NuxtLink to="/login" class="btn-primary">
          <Icon name="mdi:login" class="w-4 h-4 mr-2" />
          Войти
        </NuxtLink>
        <NuxtLink to="/register" class="btn-secondary">
          <Icon name="mdi:account-plus" class="w-4 h-4 mr-2" />
          Регистрация
        </NuxtLink>
      </div>
    </div>

    <!-- Если пользователь авторизован -->
    <div v-else>
      <!-- Заголовок -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Личный кабинет</h1>
        <p class="text-gray-600">Управляйте своим профилем и заказами</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Информация о пользователе -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">
                Информация профиля
              </h2>
              <button class="btn-secondary text-sm">
                <Icon name="mdi:pencil" class="w-4 h-4 mr-1" />
                Редактировать
              </button>
            </div>

            <div class="space-y-4">
              <!-- Аватар и основная информация -->
              <div class="flex items-center space-x-4">
                <div
                  class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <Icon name="mdi:account" class="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ authStore.user?.name }}
                  </h3>
                  <p class="text-gray-600">{{ authStore.user?.email }}</p>
                </div>
              </div>

              <!-- Детали профиля -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Полное имя</label
                  >
                  <p class="text-gray-900">{{ authStore.user?.name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Email</label
                  >
                  <p class="text-gray-900">{{ authStore.user?.email }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Дата регистрации</label
                  >
                  <p class="text-gray-900">
                    {{ formatDate(authStore.user?.createdAt) }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Статус</label
                  >
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    <Icon name="mdi:check-circle" class="w-3 h-3 mr-1" />
                    Активный
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Последние заказы -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">
                Последние заказы
              </h2>
              <NuxtLink to="/orders" class="btn-secondary text-sm">
                <Icon name="mdi:package-variant" class="w-4 h-4 mr-1" />
                Все заказы
              </NuxtLink>
            </div>

            <!-- Пока заказов нет -->
            <div class="text-center py-8">
              <Icon
                name="mdi:package-variant-closed"
                class="w-12 h-12 text-gray-400 mx-auto mb-4"
              />
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                Заказов пока нет
              </h3>
              <p class="text-gray-600 mb-4">Начните покупки в нашем каталоге</p>
              <NuxtLink to="/products" class="btn-primary">
                <Icon name="mdi:shopping" class="w-4 h-4 mr-2" />
                Смотреть товары
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Боковая панель -->
        <div class="space-y-6">
          <!-- Быстрые действия -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Быстрые действия
            </h3>
            <div class="space-y-3">
              <NuxtLink
                to="/products"
                class="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon name="mdi:shopping" class="w-5 h-5 text-blue-600 mr-3" />
                <span class="text-gray-700">Каталог товаров</span>
              </NuxtLink>
              <button
                class="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon name="mdi:heart" class="w-5 h-5 text-red-500 mr-3" />
                <span class="text-gray-700">Избранное</span>
              </button>
              <button
                class="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon name="mdi:history" class="w-5 h-5 text-green-600 mr-3" />
                <span class="text-gray-700">История покупок</span>
              </button>
              <button
                class="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon name="mdi:cog" class="w-5 h-5 text-gray-600 mr-3" />
                <span class="text-gray-700">Настройки</span>
              </button>
            </div>
          </div>

          <!-- Статистика -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Статистика</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Всего заказов</span>
                <span class="font-semibold text-gray-900">0</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Общая сумма</span>
                <span class="font-semibold text-gray-900">$0.00</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Товаров в корзине</span>
                <span class="font-semibold text-gray-900">0</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">В избранном</span>
                <span class="font-semibold text-gray-900">0</span>
              </div>
            </div>
          </div>

          <!-- Выход -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <button
              @click="handleLogout"
              :disabled="authStore.isLoading"
              class="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
            >
              <Icon name="mdi:logout" class="w-4 h-4 mr-2" />
              {{ authStore.isLoading ? "Выходим..." : "Выйти из аккаунта" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore();

// Форматирование даты
const formatDate = (dateString) => {
  if (!dateString) return "Не указано";
  return new Date(dateString).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Выход из аккаунта
const handleLogout = async () => {
  const confirmed = confirm("Вы действительно хотите выйти из аккаунта?");
  if (confirmed) {
    await authStore.logout();
  }
};

// Настройки страницы
useHead({
  title: "Личный кабинет - My Shop",
  meta: [
    {
      name: "description",
      content: "Управляйте своим профилем и заказами в My Shop",
    },
  ],
});
</script>
