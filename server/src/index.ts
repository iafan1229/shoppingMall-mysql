// index.ts
import express, { Request, Response } from "express";

// 1️⃣ Express 앱 생성
const app = express();

// 2️⃣ JSON 바디 파싱 미들웨어
app.use(express.json());

// 3️⃣ 기본 라우트
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Node.js!");
});

// 4️⃣ 다른 라우트 예시
app.get("/api/users", (req: Request, res: Response) => {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];
  res.json(users);
});

// 5️⃣ 서버 포트 설정
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
