export class ListPresenter {
  static toResponse<T>(
    message: string = 'Data retrieved successfully',
    status: string = 'success',
    data: T[],
  ) {
    return {
      message,
      status,
      data,
    };
  }
}
