import request from './request'

export const login = ({email, password}) => {
  return request.post('/login', { email, password })
}

export const register = ({name, email, password}) => {
  return request.post('/register', { name, email, password });
}

export const getUser = (userId) => {
  if (userId) {
    return request.get('/user', { params: { userId } })
  }

  return request.get('/me')
}