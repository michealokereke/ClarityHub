import { ErrorRequestHandler } from "express";
import { INTERNAL_SERVER_ERROR } from "../utils/getEnv";

const errorMiddleaware: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err.status || INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    message: err.message || "internal server error",
    stack: err.stack,
  });
};

export default errorMiddleaware;
