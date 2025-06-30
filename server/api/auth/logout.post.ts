// API endpoint для выхода пользователя
// POST /api/auth/logout
export default defineEventHandler(async (event) => {
  try {
    // Удаляем cookie с токеном
    deleteCookie(event, "auth-token");

    return {
      success: true,
      message: "Выход выполнен успешно",
    };
  } catch (error) {
    console.error("Ошибка при выходе пользователя:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Внутренняя ошибка сервера",
    });
  }
});
