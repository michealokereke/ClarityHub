import express, { urlencoded } from "express";
import { BAD_REQUEST, CLIENT_URL, PORT } from "./utils/getEnv";
import connectDB from "./config/db";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleaware from "./middleware/error.middleware";
import authRouter from "./routes/auth.route";
import { errorFormat } from "./utils/errorFormat";
import rateLimit from "express-rate-limit";
import { authExtractor } from "./middleware/authExtractor.middleware";
import clientRouter from "./routes/client.route";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(authExtractor);

// const authRateLimit = rateLimit({ windowMs: 60 * 1000, max: 5 });

// app.use("/api/v1/auth/", authRateLimit);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/clients", clientRouter);

app.get("/", (req, res) => {
  // throw errorFormat("works but not yet", BAD_REQUEST);

  res.json({ messgae: "welcome" });
});

app.use(errorMiddleaware);
const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
};

start();
