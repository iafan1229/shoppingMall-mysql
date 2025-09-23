import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 카테고리 생성
  const electronics = await prisma.category.create({
    data: {
      name: "전자제품",
      description: "스마트폰, 노트북, 태블릿 등",
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: "의류",
      description: "남성복, 여성복, 아동복",
    },
  });

  const books = await prisma.category.create({
    data: {
      name: "도서",
      description: "소설, 전문서적, 만화책",
    },
  });

  // 상품 생성
  const products = [
    {
      name: "iPhone 15 Pro",
      description: "최신 Apple 스마트폰",
      price: 1200000,
      stock: 50,
      categoryId: electronics.id,
      imageUrl: "https://via.placeholder.com/300x200?text=iPhone+15+Pro",
    },
    {
      name: "MacBook Air M3",
      description: "초경량 노트북",
      price: 1500000,
      stock: 30,
      categoryId: electronics.id,
      imageUrl: "https://via.placeholder.com/300x200?text=MacBook+Air",
    },
    {
      name: "나이키 에어맥스",
      description: "편안한 운동화",
      price: 120000,
      stock: 100,
      categoryId: clothing.id,
      imageUrl: "https://via.placeholder.com/300x200?text=Nike+Air+Max",
    },
    {
      name: "타입스크립트 프로그래밍",
      description: "웹 개발 입문서",
      price: 35000,
      stock: 200,
      categoryId: books.id,
      imageUrl: "https://via.placeholder.com/300x200?text=TypeScript+Book",
    },
    {
      name: "React 완벽 가이드",
      description: "React 개발 바이블",
      price: 42000,
      stock: 150,
      categoryId: books.id,
      imageUrl: "https://via.placeholder.com/300x200?text=React+Guide",
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("✅ 테스트 데이터가 성공적으로 생성되었습니다!");
}

main()
  .catch((e) => {
    console.error("❌ 테스트 데이터 생성 실패:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
