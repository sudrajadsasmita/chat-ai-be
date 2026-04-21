// src/adapters/inbound/rest/shared/paginate.presenter.ts
export class PaginatePresenter {
  static toResponse<T>(
    message: string = 'Data retrieved successfully',
    status: string = 'success',
    data: T[],
    total: number,
    page: number,
    limit: number,
  ) {
    return {
      status,
      message,
      data,
      total,
      page,
      limit,
    };
  }
}
