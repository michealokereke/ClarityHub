import { RequestHandler, Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

const schemaValidator =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  };

export default schemaValidator;
