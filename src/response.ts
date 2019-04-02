import Context from "@tleef/context-js";

interface IError {
  message: string;
}

interface IRes {
  data?: any;
  error?: IError;
}

const response = (ctx: Context, statusCode: number, body: IRes) => {
  if (!(ctx instanceof Context)) {
    throw new Error("ctx must be a Context");
  }

  if (!Number.isInteger(statusCode)) {
    throw new Error("statusCode must be an Integer");
  }

  if (body.data && body.data !== Object(body.data)) {
    throw new Error("data must be an Object");
  }

  if (body.error && body.error !== Object(body.error)) {
    throw new Error("error must be an Object");
  }

  if ((body.data && body.error) || (!body.data && !body.error)) {
    throw new Error("data xor error must be defined");
  }

  return {
    body: JSON.stringify({
      data: body.data,
      error: body.error,
      request_id: ctx.id,
      status_code: statusCode,
    }),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    statusCode,
  };
};

const data = (dat = {}): IRes => {
  if (dat !== Object(dat)) {
    throw new Error("data must be an Object");
  }

  return {
    data: dat,
  };
};

const error = (message: string): IRes => {
  if (!message || typeof message !== "string") {
    throw new Error("message must be a non-empty String");
  }

  return {
    error: {
      message,
    },
  };
};

const statusCodes = {
  BadRequest: 400,
  InternalServerError: 500,
  OK: 200,
  Unauthenticated: 401,
  Unauthorized: 403,
};

response.statusCodes = statusCodes;
response.error = error;
response.data = data;

export default response;

export {
  statusCodes,
  error,
  data,
};
