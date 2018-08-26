import Context from '@tleef/context-js'

const response = (ctx, statusCode, {data, error}) => {
  if (!(ctx instanceof Context)) {
    throw new Error('ctx must be a Context')
  }

  if (!Number.isInteger(statusCode)) {
    throw new Error('statusCode must be an Integer')
  }

  if (data && data !== Object(data)) {
    throw new Error('data must be an Object')
  }

  if (error && error !== Object(error)) {
    throw new Error('error must be an Object')
  }

  if ((data && error) || (!data && !error)) {
    throw new Error('data xor error must be defined')
  }

  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status_code: statusCode,
      request_id: ctx.id,
      data,
      error
    })
  }
}

const data = (data = {}) => {
  if (data !== Object(data)) {
    throw new Error('data must be an Object')
  }

  return {
    data
  }
}

const error = (message) => {
  if (!message || typeof message !== 'string') {
    throw new Error('message must be a non-empty String')
  }

  return {
    error: {
      message
    }
  }
}

const statusCodes = {
  OK: 200,
  BadRequest: 400,
  Unauthenticated: 401,
  Unauthorized: 403,
  InternalServerError: 500
}

response.statusCodes = statusCodes
response.error = error
response.data = data

export default response

export {
  statusCodes,
  error,
  data
}
