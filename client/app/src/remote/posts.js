import request from './request'

export const list = ({ page, size }) => {
  return request.get('/posts', { params: { page, size } })
}