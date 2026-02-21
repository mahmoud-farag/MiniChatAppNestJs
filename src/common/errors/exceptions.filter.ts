import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import type { Response } from "express";



@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();


        const statusCode = exception instanceof HttpException ?
            exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException ?
            exception.message : 'Internal Server Error';

        response.status(statusCode).json({
            success: false,
            message,
            statusCode,
        });
    }
}