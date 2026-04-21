export class ShowPresenter {
  static toResponse<T>(
    message: string = 'Data retrieved successfully',
    status: string = 'success',
    data: T | null,
  ) {
    const response = {
      message,
      status,
      data,
    } as { data?: T | null; message: string; status: string };
    if (status != 'success') {
      delete response.data;
    }
    return response;
  }
}
