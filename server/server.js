import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import transactionRouter from "./routes/transactionRoutes.js";

//create express app and http server
const app = express();
const server = http.createServer(app);

//middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => {
  res.send("server is live");
});
app.use("/api/auth", userRouter);
app.use("/api/transactions", transactionRouter);

//connect to DB
await connectDB();

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}

// for vercel
export default server;
