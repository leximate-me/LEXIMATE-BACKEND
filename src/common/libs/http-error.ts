export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string | any // <-- permite string o array
  ) {
    super(typeof message === 'string' ? message : 'Error');
  }

  static badRequest(message: string | any) {
    return new HttpError(400, message);
  }

  static notFound(message: string | any) {
    return new HttpError(404, message);
  }

  static unauthorized(message: string | any) {
    return new HttpError(401, message);
  }

  static forbidden(message: string | any) {
    return new HttpError(403, message);
  }

  static internalServerError(
    message: string | any = 'Error interno del servidor'
  ) {
    return new HttpError(500, message);
  }
}
