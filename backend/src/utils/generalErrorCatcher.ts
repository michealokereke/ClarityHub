import { Response, Request, NextFunction, RequestHandler } from "express";

const generalErrorCather =
  (requestFunction: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await requestFunction(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export default generalErrorCather;
