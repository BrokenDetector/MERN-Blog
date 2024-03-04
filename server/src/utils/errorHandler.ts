import { NextFunction, Request, Response } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	const statusCode = res.statusCode || 500;
	res.status(statusCode);
	res.json({ message: err.message, stack: process.env.NODE_ENV === "dev" ? err.stack : null });
};

export default errorHandler;
