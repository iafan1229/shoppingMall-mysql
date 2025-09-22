import express, { Request, Response } from "express";
import prisma from "./lib/prisma";

const app = express();

// JSON 바디 파싱 미들웨어
app.use(express.json());

// 기본 라우트
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Shopping Mall API with MySQL & Prisma!");
});

// 카테고리 관련 API
app.get("/api/categories", async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
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
