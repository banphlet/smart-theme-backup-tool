'use strict'

/**
 * Returns true if the first sort criteria in the sort order is sorting in descending order
 */
export default function isDescendingSort (sortCriteria) {
  const hasSortCriteria = sortCriteria && sortCriteria.size > 0

  if (hasSortCriteria) {
    const firstSortKey = sortCriteria.keys().next().value
    return sortCriteria.get(firstSortKey) === -1
  }

  return false
}
