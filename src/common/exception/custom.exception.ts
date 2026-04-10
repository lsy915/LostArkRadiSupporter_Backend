import { HttpException } from "@nestjs/common";
import { ErrorCodeItem } from "./error-code";

export class CustomException extends HttpException {
  constructor(
    errorCode: ErrorCodeItem,
    message: string,
    // USER_NOT_EXIST, USER_ALREADY_EXIST 같은 리소스별 동적 errorType을 쓸 때 사용
    errorTypeOverride?: string,
  ) {
    super(
      {
        statusCode: errorCode.statusCode,
        errorType: errorTypeOverride ?? errorCode.errorType,
        message,
      },
      errorCode.statusCode,
    );
  }
}
