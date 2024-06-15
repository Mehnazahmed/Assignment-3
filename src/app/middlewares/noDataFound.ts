import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const notDataFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    statusCode: 404,
    message: "No Data Found",
    data: [],
  });
};
export default notDataFound;
