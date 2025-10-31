export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly publicMessage: any;

  constructor(statusCode: number, message: any) {
    super(typeof message === 'string' ? message : 'Error');
    this.statusCode = statusCode;
    this.publicMessage = message;
  }

  static badRequest(message: any) {
    return new HttpError(400, message);
  }

  static unauthorized(message: any) {
    return new HttpError(401, message);
  }

  static paymentRequired(message: any) {
    return new HttpError(402, message);
  }

  static forbidden(message: any) {
    return new HttpError(403, message);
  }

  static notFound(message: any) {
    return new HttpError(404, message);
  }

  static methodNotAllowed(message: any) {
    return new HttpError(405, message);
  }

  static conflict(message: any) {
    return new HttpError(409, message);
  }

  static unsupportedMediaType(message: any) {
    return new HttpError(415, message);
  }

  static unprocessableEntity(message: any) {
    return new HttpError(422, message);
  }

  static tooManyRequests(message: any) {
    return new HttpError(429, message);
  }

  static internalServerError(message: any = 'Error interno del servidor') {
    return new HttpError(500, message);
  }

  static notImplemented(message: any) {
    return new HttpError(501, message);
  }

  static serviceUnavailable(message: any) {
    return new HttpError(503, message);
  }

  public getErrorText() {
    switch (this.statusCode) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 402:
        return 'Payment Required';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not Found';
      case 405:
        return 'Method Not Allowed';
      case 409:
        return 'Conflict';
      case 415:
        return 'Unsupported Media Type';
      case 422:
        return 'Unprocessable Entity';
      case 429:
        return 'Too Many Requests';
      case 500:
        return 'Internal Server Error';
      case 501:
        return 'Not Implemented';
      case 503:
        return 'Service Unavailable';
      default:
        return 'Error';
    }
  }
}
