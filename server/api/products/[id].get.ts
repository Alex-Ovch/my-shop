import { prisma } from "~/lib/prisma";

// API endpoint для получения одного товара по ID
// GET /api/products/123
export default defineEventHandler(async (event) => {
  try {
    // Получаем ID товара из URL
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID товара не указан",
      });
    }

    // Ищем товар в базе данных
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    // Если товар не найден
    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: "Товар не найден",
      });
    }

    // Возвращаем товар
    return {
      success: true,
      data: product,
    };
  } catch (error) {
    // Если произошла ошибка
    console.error("Ошибка при получении товара:", error);

    // Если это уже наша ошибка (404, 400) - пробрасываем её
    if (error instanceof Error && "statusCode" in error) {
      throw error;
    }

    // Иначе возвращаем общую ошибку сервера
    throw createError({
      statusCode: 500,
      statusMessage: "Ошибка при получении товара",
    });
  }
});
