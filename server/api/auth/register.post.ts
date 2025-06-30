import { z, ZodError } from "zod";
import { prisma } from "~/lib/prisma";
import { hashPassword, createToken } from "~/lib/auth";

// Схема валидации для регистрации
const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(50, "Имя не должно превышать 50 символов"),
  email: z.string().email("Введите корректный email адрес").toLowerCase(),
  password: z
    .string()
    .min(6, "Пароль должен содержать минимум 6 символов")
    .max(100, "Пароль не должен превышать 100 символов"),
});

// API endpoint для регистрации пользователя
// POST /api/auth/register
export default defineEventHandler(async (event) => {
  try {
    // Получаем данные из тела запроса
    const body = await readBody(event);

    // Валидируем данные
    const validatedData = registerSchema.parse(body);

    // Проверяем, не существует ли уже пользователь с таким email
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    });

    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: "Пользователь с таким email уже существует",
      });
    }

    // Хешируем пароль
    const hashedPassword = await hashPassword(validatedData.password);

    // Создаем нового пользователя
    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });

    // Создаем JWT токен
    const token = createToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
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
      message: "Пользователь успешно зарегистрирован",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
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
    console.error("Ошибка при регистрации пользователя:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Внутренняя ошибка сервера",
    });
  }
});
