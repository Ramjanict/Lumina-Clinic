import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { MulterError } from "multer";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof MulterError) {
      const message =
        exception.code === "LIMIT_FILE_SIZE"
          ? "Image must be under 2MB"
          : "Could not upload that image";
      response.status(HttpStatus.BAD_REQUEST).json({
        message,
        statusCode: HttpStatus.BAD_REQUEST,
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      let message = exception.message;
      if (typeof body === "string") {
        message = body;
      } else if (body && typeof body === "object" && "message" in body) {
        const raw = (body as { message: string | string[] }).message;
        message = Array.isArray(raw) ? raw[0] : raw;
      }
      response.status(status).json({ message, statusCode: status });
      return;
    }

    console.error(exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
