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
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Создание аккаунта</h2>
        <p class="text-gray-600">Заполните форму для регистрации</p>
      </div>

      <!-- Форма регистрации -->
      <div class="bg-white py-8 px-6 shadow-lg rounded-lg">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Поле "Имя" -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Полное имя
            </label>
            <div class="relative">
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                autocomplete="name"
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300',
                ]"
                placeholder="Введите ваше полное имя"
              />
              <Icon
                name="mdi:account"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
            </div>
            <p v-if="errors.name" class="mt-2 text-sm text-red-600">
              {{ errors.name }}
            </p>
          </div>

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
                autocomplete="new-password"
                :class="[
                  'w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                  errors.password
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300',
                ]"
                placeholder="Минимум 6 символов"
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

          <!-- Подтверждение пароля -->
          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Подтверждение пароля
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                autocomplete="new-password"
                :class="[
                  'w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                  errors.confirmPassword
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300',
                ]"
                placeholder="Повторите пароль"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Icon
                  :name="showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'"
                  class="w-5 h-5"
                />
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-2 text-sm text-red-600">
              {{ errors.confirmPassword }}
            </p>
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
            <Icon v-else name="mdi:account-plus" class="w-5 h-5 mr-2" />
            {{
              authStore.isLoading ? "Создание аккаунта..." : "Создать аккаунт"
            }}
          </button>
        </form>

        <!-- Ссылка на вход -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Уже есть аккаунт?
            <NuxtLink
              to="/login"
              class="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Войти
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Дополнительная информация -->
      <div class="text-center">
        <p class="text-xs text-gray-500">
          Регистрируясь, вы соглашаетесь с
          <a href="#" class="text-blue-600 hover:text-blue-500"
            >условиями использования</a
          >
          и
          <a href="#" class="text-blue-600 hover:text-blue-500"
            >политикой конфиденциальности</a
          >
        </p>
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
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// Ошибки валидации
const errors = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// Показ паролей
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Очистка ошибок при изменении полей
watch(
  () => form.name,
  () => {
    errors.name = "";
    authStore.clearError();
  }
);
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
watch(
  () => form.confirmPassword,
  () => {
    errors.confirmPassword = "";
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

  // Валидация имени
  if (!form.name.trim()) {
    errors.name = "Имя обязательно";
    isValid = false;
  } else if (form.name.trim().length < 2) {
    errors.name = "Имя должно содержать минимум 2 символа";
    isValid = false;
  }

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
  } else if (form.password.length < 6) {
    errors.password = "Пароль должен содержать минимум 6 символов";
    isValid = false;
  }

  // Валидация подтверждения пароля
  if (!form.confirmPassword) {
    errors.confirmPassword = "Подтвердите пароль";
    isValid = false;
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Пароли не совпадают";
    isValid = false;
  }

  return isValid;
};

// Обработка отправки формы
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  const result = await authStore.register({
    name: form.name.trim(),
    email: form.email.toLowerCase().trim(),
    password: form.password,
  });

  if (result.success) {
    // Успешная регистрация - перенаправление произойдет автоматически в store
    console.log("Регистрация успешна!");
  }
};

// Настройки страницы
definePageMeta({
  layout: false, // Отключаем основной layout для страницы входа
});

useHead({
  title: "Регистрация - My Shop",
  meta: [
    {
      name: "description",
      content: "Создайте аккаунт в My Shop для доступа ко всем функциям",
    },
  ],
});
</script>
