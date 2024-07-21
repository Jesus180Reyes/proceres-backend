import { WhereOptions, Op } from "sequelize";
import {ParsedQs} from 'qs';
export class Common {
    /**
   * Set value custom filter
   * @param query 
   * @param operation 
   */
  public setWhere<T>(query: ParsedQs, operation: 'or' | 'and' = 'or') {
    const filters: WhereOptions<T>[] = [];
    let where: WhereOptions<T> | undefined = undefined;

    for (const key in query) {
      if (key != 'page' && key != 'limit' && key != 'orderBy' && key != 'op') {
        filters.push({ [key]: { [Op.like]: `%${query[key]}%` } } as WhereOptions<T>)
      }
    }

    if (filters.length > 0) {
      if (filters.length > 1) {
        where = {
          [Op[operation]]: filters
        } as WhereOptions<T>
      }
      else where = filters[0];
    }

    return where;
  }
}