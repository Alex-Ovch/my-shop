import { prisma } from "~/lib/prisma";

// API endpoint для получения всех товаров
// GET /api/products
export default defineEventHandler(async (event) => {
  try {
    // Получаем все товары из базы данных
    const products = await prisma.product.findMany({
      where: {
        inStock: true, // Только товары в наличии
      },
      orderBy: {
        createdAt: "desc", // Сначала новые товары
      },
    });

    // Возвращаем товары
    return {
      success: true,
      data: products,
      count: products.length,
    };
  } catch (error) {
    // Если произошла ошибка
    console.error("Ошибка при получении товаров:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Ошибка при получении товаров",
    });
  }
});
