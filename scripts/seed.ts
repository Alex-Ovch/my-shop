import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Добавляем тестовые данные...");

  // Удаляем существующие данные (для чистоты)
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Очищены старые данные");

  // Создаем тестового пользователя
  const hashedPassword = await bcrypt.hash("demo123", 12);
  const demoUser = await prisma.user.create({
    data: {
      name: "Демо Пользователь",
      email: "demo@example.com",
      password: hashedPassword,
    },
  });

  console.log("👤 Создан тестовый пользователь: demo@example.com / demo123");

  // Добавляем тестовые товары
  const products = await prisma.product.createMany({
    data: [
      {
        name: "iPhone 15 Pro",
        description:
          "Новейший смартфон Apple с титановым корпусом и камерой 48MP",
        price: 999.99,
        imageUrl:
          "https://www.lab9.be/cdn/shop/files/iPhone_15_Pro_Max_Blue_Titanium_PDP_Image_Position-1__WWEN_16464a33-cacc-4482-93c7-9649e2e3e210.jpg?v=1696424070&width=1445",
        inStock: true,
      },
      {
        name: "MacBook Air M3",
        description:
          "Ультрапортативный ноутбук с чипом M3 и 13-дюймовым дисплеем",
        price: 1299.99,
        imageUrl:
          "https://cf-images.dustin.eu/cdn-cgi/image/fit=contain,format=auto,quality=75,width=828,fit=contain/image/d2000010011156426/apple-macbook-air-2024-spacegrijs-m3-8gb-512gb-136.png",
        inStock: true,
      },
      {
        name: "AirPods Pro",
        description: "Беспроводные наушники с активным шумоподавлением",
        price: 249.99,
        imageUrl:
          "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-pro-2-hero-select-202409_FMT_WHH?wid=750&hei=556&fmt=jpeg&qlt=90&.v=1724041668836",
        inStock: true,
      },
      {
        name: "Apple Watch Series 9",
        description: "Умные часы с новым процессором S9 и ярким дисплеем",
        price: 399.99,
        imageUrl:
          "https://m.media-amazon.com/images/I/713kz8xK3ML._UF1000,1000_QL80_.jpg",
        inStock: true,
      },
      {
        name: "iPad Pro 12.9",
        description:
          "Профессиональный планшет с чипом M2 и дисплеем Liquid Retina XDR",
        price: 1099.99,
        imageUrl:
          "https://best-magazin.com/image/cache/catalog/Apple/iPad/Pro/12.9%20%282022%29/image%201-800x800.png",
        inStock: true, // Этот товар не в наличии
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        description: "Флагманский Android смартфон с S Pen и камерой 200MP",
        price: 1199.99,
        imageUrl:
          "https://files.refurbed.com/ii/samsung-galaxy-s24-ultra-1705563165.jpg",
        inStock: true,
      },
      {
        name: "Sony PlayStation 5",
        description: "Игровая консоль нового поколения с SSD и 3D-звуком",
        price: 499.99,
        imageUrl:
          "https://www.gooplaystation4.nl/images/thumbnails/1200/1200/detailed/36/PS5-normaal.jpg",
        inStock: true,
      },
      {
        name: "Dell XPS 13",
        description: 'Ультрабук премиум-класса с 13.4" дисплеем InfinityEdge',
        price: 1099.99,
        imageUrl:
          "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/9345/media-gallery/touch/silver/notebook-xps-13-9345-t-silver-gallery-4.psd?fmt=pjpg&pscan=auto&scl=1&wid=3509&hei=2082&qlt=100,1&resMode=sharp2&size=3509,2082&chrss=full&imwidth=5000",
        inStock: true,
      },
      {
        name: "Nintendo Switch OLED",
        description: "Портативная игровая консоль с OLED-экраном 7 дюймов",
        price: 349.99,
        imageUrl:
          "https://www.goonintendoswitch.nl/images/thumbnails/1200/1200/detailed/37/OLED-Switch.jpg",
        inStock: true, // Нет в наличии
      },
      {
        name: "Bose QuietComfort 45",
        description: "Премиальные наушники с лучшим в классе шумоподавлением",
        price: 329.99,
        imageUrl: "https://m.media-amazon.com/images/I/51qfLURUtpL.jpg",
        inStock: true,
      },
      {
        name: "GoPro Hero 12",
        description: "Экшн-камера 5.3K с усовершенствованной стабилизацией",
        price: 399.99,
        imageUrl:
          "https://tweakers.net/i/oTEUVJaX5nnP91M8mja2cH2vVww=/fit-in/374x326/filters:fill(white):strip_exif()/i/2006077352.png?f=imagemediumplus",
        inStock: true,
      },
      {
        name: "Microsoft Surface Pro 9",
        description: "2-в-1 планшет и ноутбук с процессором Intel Core i7",
        price: 1299.99,
        imageUrl:
          "https://tomtronics.nl/wp-content/uploads/2024/01/Ongetiteld.jpg",
        inStock: true,
      },
    ],
  });

  console.log(`✅ Добавлено ${products.count} товаров`);
  console.log("✅ Готово! Данные для тестирования созданы");
}

main()
  .catch((e) => {
    console.error("❌ Ошибка при добавлении данных:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
