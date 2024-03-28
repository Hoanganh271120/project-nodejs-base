/* eslint-disable no-magic-numbers */
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_NUMBER } from '../../shared/constants/app.constant.js';

export const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} data - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * @typedef {Object} Option
   * @property {string} sortBy - Sort option in the format: sortField:(desc|asc)
   * @property {string} populate - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @property {number} limit - Maximum number of results per page (default = 10)
   * @property {number} page - Current page (default = 1)
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Option} [options] - Query options
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginate = async function (filter, options) {
    let sort = '';
    if (options.sortBy) {
      const sortingCriteria = [];
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : DEFAULT_PAGE_LIMIT;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : DEFAULT_PAGE_NUMBER;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).collation({ locale: 'en' }).sort(sort).skip(skip).limit(limit);

    if (options.populate) {
      options.populate.split(',').forEach((populateOption) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split('.')
            .reverse()
            .reduce((a, b) => ({ path: b, populate: a })),
        );
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        data: results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};
