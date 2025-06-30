import { z, ZodError } from "zod";
import { prisma } from "~/lib/prisma";
import { comparePassword, createToken } from "~/lib/auth";

// Схема валидации для входа
const loginSchema = z.object({
  email: z.string().email("Введите корректный email адрес").toLowerCase(),
  password: z.string().min(1, "Пароль обязателен"),
});

// API endpoint для входа пользователя
// POST /api/auth/login
export default defineEventHandler(async (event) => {
  try {
    // Получаем данные из тела запроса
    const body = await readBody(event);

    // Валидируем данные
    const validatedData = loginSchema.parse(body);

    // Ищем пользователя по email
    const user = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    });

    // Если пользователь не найден
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Неверный email или пароль",
      });
    }

    // Проверяем пароль
    const isPasswordValid = await comparePassword(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: "Неверный email или пароль",
      });
    }

    // Создаем JWT токен
    const token = createToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    // Устанавливаем cookie с токеном
    setCookie(event, "auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });

    // Возвращаем успешный ответ (без пароля)
    return {
      success: true,
      message: "Вход выполнен успешно",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  } catch (error) {
    // Если это ошибка валидации Zod
    if (error instanceof ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Ошибка валидации данных",
        data: error.issues,
      });
    }

    // Если это уже наша ошибка
    if (typeof error === "object" && error && "statusCode" in error) {
      throw error;
    }

    // Логируем неожиданную ошибку
    console.error("Ошибка при входе пользователя:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Внутренняя ошибка сервера",
    });
  }
});
