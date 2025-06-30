import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Интерфейс для пользователя в токене
export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
}

// Создание JWT токена
export function createToken(payload: JWTPayload): string {
  const secret = useRuntimeConfig().jwtSecret;

  if (!secret) {
    throw new Error("JWT_SECRET не установлен");
  }

  return jwt.sign(payload, secret, {
    expiresIn: "7d", // Токен действует 7 дней
  });
}

// Проверка JWT токена
export function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = useRuntimeConfig().jwtSecret;

    if (!secret) {
      throw new Error("JWT_SECRET не установлен");
    }

    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("Ошибка проверки токена:", error);
    return null;
  }
}

// Хеширование пароля
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Проверка пароля
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Получение пользователя из токена в cookie
export function getUserFromToken(event: any): JWTPayload | null {
  try {
    // Получаем токен из cookie
    const token = getCookie(event, "auth-token");

    if (!token) {
      return null;
    }

    // Проверяем токен
    return verifyToken(token);
  } catch (error) {
    console.error("Ошибка получения пользователя из токена:", error);
    return null;
  }
}
