import { getUserFromToken } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

// API endpoint для получения данных текущего пользователя
// GET /api/auth/me
export default defineEventHandler(async (event) => {
  try {
    // Получаем пользователя из токена
    const tokenUser = getUserFromToken(event);

    if (!tokenUser) {
      throw createError({
        statusCode: 401,
        statusMessage: "Пользователь не авторизован",
      });
    }

    // Получаем актуальные данные пользователя из БД
    const user = await prisma.user.findUnique({
      where: {
        id: tokenUser.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        // password НЕ включаем в ответ
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "Пользователь не найден",
      });
    }

    return {
      success: true,
      user: user,
    };
  } catch (error) {
    // Если это уже наша ошибка
    if (typeof error === "object" && error && "statusCode" in error) {
      throw error;
    }

    console.error("Ошибка при получении данных пользователя:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Внутренняя ошибка сервера",
    });
  }
});
