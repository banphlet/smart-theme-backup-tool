import React from 'react'
import request from '../Lib/requests'

export const getAxiosErrors = error => {
  return error?.response?.data?.errors ?? error.response?.data?.message
}

export default function useQuery({
  path,
  initQuery = {},
  initialLoad = true
}) {
  const [loading, setLoading] = React.useState(initialLoad)
  const [data, setData] = React.useState()
  const [error, setError] = React.useState()

  React.useEffect(() => {
    if (!initialLoad) return
    loadData({ useInitialQuery: true })
  }, [])

  const loadData = ({
    query = {},
    isLoadMore = false,
    showLoader = true,
    useInitialQuery,
    onlyQuery = true,
    routePath = path
  } = {}) => {
    showLoader && setLoading(true)
    return request
      .get(routePath, {
        params: useInitialQuery
          ? initQuery
          : onlyQuery
            ? query
            : {
              ...query,
              ...initQuery
            }
      })
      .then(responseData => {
        if (!isLoadMore) {
          setData(responseData)
        } else {
          const newData = Array.isArray(responseData)
            ? [...data, ...responseData]
            : {
              ...responseData,
              data: [...data?.data, ...responseData.data]
            }
          setData(newData)
        }
        setLoading(false)
        return responseData
      })
      .catch(errorData => {
        const err = getAxiosErrors(errorData)
        setError(err)
        setLoading(false)
      })
  }

  return {
    loading,
    data,
    refetch: loadData,
    error,
    updateData: setData,
    loadMore: query => loadData({ query, isLoadMore: true })
  }
}
