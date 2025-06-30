<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <!-- Заголовок -->
      <div class="text-center">
        <NuxtLink
          to="/"
          class="flex items-center justify-center space-x-2 mb-6"
        >
          <Icon name="mdi:shopping" class="w-10 h-10 text-blue-600" />
          <span class="text-2xl font-bold text-gray-900">My Shop</span>
        </NuxtLink>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Вход в аккаунт</h2>
        <p class="text-gray-600">Введите ваши данные для входа</p>
      </div>

      <!-- Форма входа -->
      <div class="bg-white py-8 px-6 shadow-lg rounded-lg">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Поле "Email" -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Email адрес
            </label>
            <div class="relative">
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300',
                ]"
                placeholder="example@mail.com"
              />
              <Icon
                name="mdi:email"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
            </div>
            <p v-if="errors.email" class="mt-2 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <!-- Поле "Пароль" -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Пароль
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                :class="[
                  'w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                  errors.password
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300',
                ]"
                placeholder="Введите ваш пароль"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Icon
                  :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'"
                  class="w-5 h-5"
                />
              </button>
            </div>
            <p v-if="errors.password" class="mt-2 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <!-- Дополнительные опции -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Запомнить меня
              </label>
            </div>

            <div class="text-sm">
              <a
                href="#"
                class="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Забыли пароль?
              </a>
            </div>
          </div>

          <!-- Общая ошибка -->
          <div
            v-if="authStore.error"
            class="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div class="flex items-center">
              <Icon name="mdi:alert-circle" class="w-5 h-5 text-red-500 mr-2" />
              <p class="text-sm text-red-700">{{ authStore.error }}</p>
            </div>
          </div>

          <!-- Кнопка отправки -->
          <button
            type="submit"
            :disabled="authStore.isLoading"
            :class="[
              'w-full btn-primary text-lg py-3 flex items-center justify-center',
              authStore.isLoading && 'opacity-75 cursor-not-allowed',
            ]"
          >
            <Icon
              v-if="authStore.isLoading"
              name="mdi:loading"
              class="w-5 h-5 mr-2 animate-spin"
            />
            <Icon v-else name="mdi:login" class="w-5 h-5 mr-2" />
            {{ authStore.isLoading ? "Выполняем вход..." : "Войти" }}
          </button>
        </form>

        <!-- Ссылка на регистрацию -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Нет аккаунта?
            <NuxtLink
              to="/register"
              class="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Зарегистрироваться
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Быстрый вход для демо -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="text-center">
          <h3 class="text-sm font-medium text-blue-800 mb-2">Демо аккаунт</h3>
          <p class="text-xs text-blue-600 mb-3">
            Для быстрого тестирования используйте:
          </p>
          <div class="text-xs text-blue-700 space-y-1">
            <p><strong>Email:</strong> demo@example.com</p>
            <p><strong>Пароль:</strong> demo123</p>
          </div>
          <button
            @click="fillDemoData"
            class="mt-3 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
          >
            Заполнить демо данные
          </button>
        </div>
      </div>

      <!-- Альтернативные способы входа -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-gray-50 text-gray-500">Или войдите через</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <button
          class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <Icon name="mdi:google" class="w-5 h-5 text-red-500" />
          <span class="ml-2">Google</span>
        </button>
        <button
          class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <Icon name="mdi:facebook" class="w-5 h-5 text-blue-600" />
          <span class="ml-2">Facebook</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Если пользователь уже авторизован, перенаправляем на главную
const authStore = useAuthStore();

if (authStore.isAuthenticated) {
  await navigateTo("/");
}

// Форма
const form = reactive({
  email: "",
  password: "",
});

// Ошибки валидации
const errors = reactive({
  email: "",
  password: "",
});

// Показ пароля
const showPassword = ref(false);

// Очистка ошибок при изменении полей
watch(
  () => form.email,
  () => {
    errors.email = "";
    authStore.clearError();
  }
);
watch(
  () => form.password,
  () => {
    errors.password = "";
    authStore.clearError();
  }
);

// Валидация формы
const validateForm = () => {
  let isValid = true;

  // Очищаем предыдущие ошибки
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });

  // Валидация email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) {
    errors.email = "Email обязателен";
    isValid = false;
  } else if (!emailRegex.test(form.email)) {
    errors.email = "Введите корректный email";
    isValid = false;
  }

  // Валидация пароля
  if (!form.password) {
    errors.password = "Пароль обязателен";
    isValid = false;
  }

  return isValid;
};

// Заполнение демо данных
const fillDemoData = () => {
  form.email = "demo@example.com";
  form.password = "demo123";
};

// Обработка отправки формы
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  const result = await authStore.login({
    email: form.email.toLowerCase().trim(),
    password: form.password,
  });

  if (result.success) {
    // Успешный вход - перенаправление произойдет автоматически в store
    console.log("Вход выполнен успешно!");
  }
};

// Настройки страницы
definePageMeta({
  layout: false, // Отключаем основной layout для страницы входа
});

useHead({
  title: "Вход - My Shop",
  meta: [{ name: "description", content: "Войдите в свой аккаунт My Shop" }],
});
</script>
