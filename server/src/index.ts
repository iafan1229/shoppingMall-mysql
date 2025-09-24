import express, { Request, Response } from "express";
import prisma from "./lib/prisma";
import cors from "cors";

const app = express();

// CORS 설정 추가
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);

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
          },
        },
        {
          description: {
            contains: keyword as string,
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

// server/src/index.ts에 추가할 API들

// 개별 상품 상세 정보 API
app.get("/api/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 장바구니 아이템 삭제 API
app.delete(
  "/api/cart/:userId/:productId",
  async (req: Request, res: Response) => {
    try {
      const { userId, productId } = req.params;

      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId: parseInt(userId),
            productId: parseInt(productId),
          },
        },
      });

      res.json({ message: "장바구니에서 삭제되었습니다." });
    } catch (error) {
      console.error("Error deleting cart item:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// 장바구니 수량 업데이트 API
app.put("/api/cart", async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity } = req.body;

    // 재고 확인
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
    }

    if (product.stock < parseInt(quantity)) {
      return res.status(400).json({
        error: "재고가 부족합니다.",
        availableStock: product.stock,
      });
    }

    const cartItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: parseInt(userId),
          productId: parseInt(productId),
        },
      },
      data: {
        quantity: parseInt(quantity),
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    res.json(cartItem);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 기존 장바구니 추가 API 수정 (재고 확인 추가)
app.post("/api/cart", async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity } = req.body;

    // 재고 확인
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
    }

    // 현재 장바구니에 있는 수량 확인
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: parseInt(userId),
          productId: parseInt(productId),
        },
      },
    });

    const currentQuantity = existingCartItem ? existingCartItem.quantity : 0;
    const totalQuantity = currentQuantity + parseInt(quantity);

    if (product.stock < totalQuantity) {
      return res.status(400).json({
        error: "재고가 부족합니다.",
        availableStock: product.stock,
        currentInCart: currentQuantity,
      });
    }

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: parseInt(userId),
          productId: parseInt(productId),
        },
      },
      update: {
        quantity: totalQuantity,
      },
      create: {
        userId: parseInt(userId),
        productId: parseInt(productId),
        quantity: parseInt(quantity),
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    res.json(cartItem);
  } catch (error) {
    console.error("Error updating cart:", error);
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
