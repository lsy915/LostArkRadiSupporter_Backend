import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const body = exception.getResponse() as Record<string, unknown>;

    // CustomException은 body에 statusCode/errorType/message가 있음
    // NestJS 기본 예외는 body.message만 있으므로 fallback 처리
    response.status(status).json({
      statusCode: body.statusCode ?? status,
      errorType: body.errorType ?? HttpStatus[status] ?? "INTERNAL_SERVER_ERROR",
      message: body.message ?? exception.message,
    });
  }
}
