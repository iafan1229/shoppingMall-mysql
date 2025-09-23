import express, { Request, Response } from "express";
import prisma from "./lib/prisma";

const app = express();

// CORS 미들웨어 (프론트엔드 연결을 위해)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// JSON 바디 파싱 미들웨어
app.use(express.json());

// 기본 라우트
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Shopping Mall API with MySQL & Prisma!");
});

// 상품 검색 API (페이지네이션, 정렬, 검색 포함)
app.get("/api/products/search", async (req: Request, res: Response) => {
  try {
    const {
      keyword = "",
      page = "1",
      limit = "10",
      sortBy = "createdAt",
      sortOrder = "desc",
      categoryId,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // 검색 조건 구성
    const where: any = {};

    // 키워드 검색 (상품명과 설명에서 검색)
    if (keyword && keyword !== "") {
      where.OR = [
        {
          name: {
            contains: keyword as string,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: keyword as string,
            mode: "insensitive",
          },
        },
      ];
    }

    // 카테고리 필터링
    if (categoryId) {
      where.categoryId = parseInt(categoryId as string);
    }

    // 정렬 옵션 설정
    const orderBy: any = {};
    if (sortBy === "price") {
      orderBy.price = sortOrder;
    } else if (sortBy === "name") {
      orderBy.name = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    // 상품 조회 (페이지네이션 포함)
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 카테고리 관련 API
app.get("/api/categories", async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/categories", async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const category = await prisma.category.create({
      data: { name, description },
    });
    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 제품 관련 API
app.get("/api/products", async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/products", async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl, stock, categoryId } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        stock: parseInt(stock),
        categoryId: parseInt(categoryId),
      },
      include: {
        category: true,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 사용자 관련 API
app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        // password는 보안상 제외
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/users", async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    const user = await prisma.user.create({
      data: { email, name, password },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        // password는 응답에서 제외
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 장바구니 관련 API
app.get("/api/cart/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: parseInt(userId) },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/cart", async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: parseInt(userId),
          productId: parseInt(productId),
        },
      },
      update: {
        quantity: parseInt(quantity),
      },
      create: {
        userId: parseInt(userId),
        productId: parseInt(productId),
        quantity: parseInt(quantity),
      },
      include: {
        product: true,
      },
    });
    res.json(cartItem);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 주문 관련 API
app.get("/api/orders/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const orders = await prisma.order.findMany({
      where: { userId: parseInt(userId) },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 서버 종료 시 Prisma 연결 정리
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

// 서버 포트 설정
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Shopping Mall Server is running on http://localhost:${PORT}`);
});
