import React from 'react'
import request from '../Lib/requests'

export const getAxiosErrors = error => {
  return error?.response?.data?.error ?? error?.response?.data?.error?.message
}

export default function useMutation ({ path, method = 'post' }) {
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState()
  const [error, setError] = React.useState()

  const makeRequest = (body = {}, makePath = path) => {
    setLoading(true)
    setError(null)
    return request[method](makePath, body)
      .then(response => {
        setLoading(false)
        setData(response)
        return response
      })
      .catch(errorData => {
        const err = getAxiosErrors(errorData)
        setError(err)
        setLoading(false)
        throw err
      })
  }

  return { loading, data, makeRequest, error }
}
