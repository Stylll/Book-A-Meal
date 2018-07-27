/**
 * function to create pagination data
 * @param {number} limit
 * @param {number} offset
 * @param {number} totalCount
 */
const paginator = (limit, offset, totalCount) => {
  const intLimit = parseInt(limit, 10);
  const intOffset = parseInt(offset, 10);
  const intTotalCount = parseInt(totalCount, 10);
  if (!Number.isInteger(intLimit) || !Number.isInteger(intOffset)
    || !Number.isInteger(intTotalCount)) {
    return {};
  }
  return {
    totalCount: intTotalCount,
    limit: intLimit,
    offset: intOffset,
    noPage: Math.ceil(intTotalCount / intLimit),
    pageNo: Math.ceil(intOffset / intLimit) + 1,
  };
};

export default paginator;
