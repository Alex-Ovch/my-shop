import { defineStore } from "pinia";

// Интерфейс пользователя
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Интерфейс для регистрации
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Интерфейс для входа
export interface LoginData {
  email: string;
  password: string;
}

export const useAuthStore = defineStore("auth", () => {
  // Состояние
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Геттеры
  const isAuthenticated = computed(() => !!user.value);

  // Очистка ошибок
  const clearError = () => {
    error.value = null;
  };

  // Установка пользователя
  const setUser = (userData: User) => {
    user.value = userData;
  };

  // Очистка пользователя
  const clearUser = () => {
    user.value = null;
  };

  // Регистрация
  const register = async (data: RegisterData) => {
    try {
      isLoading.value = true;
      clearError();

      const response = await $fetch("/api/auth/register", {
        method: "POST",
        body: data,
      });

      if (response.success && response.user) {
        setUser(response.user);

        // Перенаправляем на главную страницу
        await navigateTo("/");

        return { success: true };
      }

      throw new Error("Ошибка регистрации");
    } catch (err: any) {
      console.error("Ошибка регистрации:", err);

      if (err.statusCode === 400 && err.statusMessage) {
        error.value = err.statusMessage;
      } else {
        error.value = "Произошла ошибка при регистрации";
      }

      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Вход
  const login = async (data: LoginData) => {
    try {
      isLoading.value = true;
      clearError();

      const response = await $fetch("/api/auth/login", {
        method: "POST",
        body: data,
      });

      if (response.success && response.user) {
        setUser(response.user);

        // Перенаправляем на главную страницу
        await navigateTo("/");

        return { success: true };
      }

      throw new Error("Ошибка входа");
    } catch (err: any) {
      console.error("Ошибка входа:", err);

      if (err.statusCode === 401) {
        error.value = "Неверный email или пароль";
      } else if (err.statusMessage) {
        error.value = err.statusMessage;
      } else {
        error.value = "Произошла ошибка при входе";
      }

      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Выход
  const logout = async () => {
    try {
      isLoading.value = true;

      await $fetch("/api/auth/logout", {
        method: "POST",
      });

      clearUser();

      // Перенаправляем на главную страницу
      await navigateTo("/");
    } catch (err) {
      console.error("Ошибка выхода:", err);
      // Даже если запрос не прошел, очищаем пользователя
      clearUser();
    } finally {
      isLoading.value = false;
    }
  };

  // Получение текущего пользователя
  const fetchUser = async () => {
    try {
      const response = await $fetch("/api/auth/me");

      if (response.success && response.user) {
        setUser(response.user);
        return true;
      }

      return false;
    } catch (err) {
      console.error("Ошибка получения пользователя:", err);
      clearUser();
      return false;
    }
  };

  // Инициализация (проверка авторизации при загрузке)
  const initialize = async () => {
    await fetchUser();
  };

  return {
    // Состояние
    user: readonly(user),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Геттеры
    isAuthenticated,

    // Действия
    register,
    login,
    logout,
    fetchUser,
    initialize,
    clearError,
    setUser,
    clearUser,
  };
});
