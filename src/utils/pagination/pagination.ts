import { Common } from '../../config/helpers/common';

export class Pagination {
  public paginate(req: any) {
    let page: number = 1; // Default value for page

    if (req.query.page) {
      const parsedPage: number = parseInt(req.query.page as string);
      if (!isNaN(parsedPage) && parsedPage > 0) {
        page = parsedPage;
      } else {
        page = 1;
      }
    }
    let limit: number = req.query.limit
      ? parseInt(req.query.limit as string)
      : 10;
    let offset = (page - 1) * limit;
    let where: any = new Common().setWhere(req.query, req.query.op);

    return { page, limit, offset, where };
  }
}
