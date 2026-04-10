import { HttpStatus } from "@nestjs/common";

export interface ErrorCodeItem {
  statusCode: HttpStatus;
  errorType: string;
}

export const ErrorCode = {
  // 400
  BAD_REQUEST:        { statusCode: HttpStatus.BAD_REQUEST,            errorType: "BAD_REQUEST" },
  INVALID_PARAMETER:  { statusCode: HttpStatus.BAD_REQUEST,            errorType: "INVALID_PARAMETER" },
  MISSING_PARAMETER:  { statusCode: HttpStatus.BAD_REQUEST,            errorType: "MISSING_PARAMETER" },
  LIMIT_EXCEEDED_400: { statusCode: HttpStatus.BAD_REQUEST,            errorType: "LIMIT_EXCEEDED" },
  OUT_OF_RANGE_400:   { statusCode: HttpStatus.BAD_REQUEST,            errorType: "OUT_OF_RANGE" },

  // 401
  UNAUTHORIZED:       { statusCode: HttpStatus.UNAUTHORIZED,           errorType: "UNAUTHORIZED" },

  // 403
  FORBIDDEN:          { statusCode: HttpStatus.FORBIDDEN,              errorType: "FORBIDDEN" },
  ACCESS_DENIED:      { statusCode: HttpStatus.FORBIDDEN,              errorType: "ACCESS_DENIED" },
  LIMIT_EXCEEDED_403: { statusCode: HttpStatus.FORBIDDEN,              errorType: "LIMIT_EXCEEDED" },
  OUT_OF_RANGE_403:   { statusCode: HttpStatus.FORBIDDEN,              errorType: "OUT_OF_RANGE" },

  // 404
  NOT_FOUND:          { statusCode: HttpStatus.NOT_FOUND,              errorType: "NOT_FOUND" },

  // 409
  CONFLICT:           { statusCode: HttpStatus.CONFLICT,               errorType: "CONFLICT" },
  ALREADY_EXIST:      { statusCode: HttpStatus.CONFLICT,               errorType: "ALREADY_EXIST" },

  // 410
  DELETED:            { statusCode: HttpStatus.GONE,                   errorType: "DELETED" },

  // 500
  INTERNAL_SERVER_ERROR: { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, errorType: "INTERNAL_SERVER_ERROR" },

  // 503
  SERVICE_UNAVAILABLE:   { statusCode: HttpStatus.SERVICE_UNAVAILABLE,   errorType: "SERVICE_UNAVAILABLE" },
} as const satisfies Record<string, ErrorCodeItem>;
