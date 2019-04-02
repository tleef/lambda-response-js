/* eslint-env mocha */

import Context from "@tleef/context-js";
import * as chai from "chai";

import response, { data, error, statusCodes } from "./response";

const expect = chai.expect;

describe("response", () => {
  describe("statusCodes", () => {
    it("should expose statusCodes", () => {
      expect(statusCodes).to.deep.equal({
        BadRequest: 400,
        InternalServerError: 500,
        OK: 200,
        Unauthenticated: 401,
        Unauthorized: 403,
      });
    });
  });

  describe("data()", () => {
    it("should return an object with data key set to given data", () => {
      const o = {one: 1};

      expect(data(o)).to.deep.equal({data: o});
    });

    it("should be callable without arguments", () => {
      expect(data()).to.deep.equal({data: {}});
    });

    it("should throw if given data is not an object", () => {
      expect(() => data("test")).to.throw("data must be an Object");
    });
  });

  describe("error()", () => {
    it("should return an object with error.message set to given message", () => {
      const message = "test";

      expect(error(message)).to.deep.equal({error: {message}});
    });

    it("should throw if message is not a String", () => {
      // @ts-ignore
      expect(() => error({})).to.throw("message must be a non-empty String");
    });

    it("should throw if message is an empty String", () => {
      expect(() => error("")).to.throw("message must be a non-empty String");
    });
  });

  describe("response()", () => {
    it("should set statusCode to given value", () => {
      const res = response(new Context(), 123, data());

      expect(res.statusCode).to.equal(123);
    });

    it("should set Access-Control-Allow-Origin header to '*'", () => {
      const res = response(new Context(), statusCodes.OK, data());

      expect(res.headers["Access-Control-Allow-Origin"]).to.equal("*");
    });

    it("should set body to JSON string", () => {
      const ctx = new Context();
      // @ts-ignore
      ctx._id = "123";
      const o = {one: 1};
      const res = response(ctx, statusCodes.OK, data(o));

      expect(res.body).to.equal(JSON.stringify({
        data: o,
        request_id: ctx.id,
        status_code: statusCodes.OK,
      }));
    });

    it("should throw if ctx is not a Context", () => {
      // @ts-ignore
      expect(() => response({}, statusCodes.OK, data())).to.throw("ctx must be a Context");
    });

    it("should throw if statusCode is not an Integer", () => {
      // @ts-ignore
      expect(() => response(new Context(), "200", data())).to.throw("statusCode must be an Integer");
    });

    it("should throw if data in not an Object", () => {
      expect(() => response(new Context(), statusCodes.OK, {data: "test"})).to.throw("data must be an Object");
    });

    it("should throw if error in not an Object", () => {
      // @ts-ignore
      expect(() => response(new Context(), statusCodes.OK, {error: "test"})).to.throw("error must be an Object");
    });

    it("should throw if called without body", () => {
      // @ts-ignore
      expect(() => response(new Context(), statusCodes.OK)).to.throw("Cannot read property 'data' of undefined");
    });

    it("should throw if data and error are defined", () => {
      expect(() => response(new Context(), statusCodes.OK, {
        data: {},
        error: { message: 'error' },
      })).to.throw("data xor error must be defined");
    });

    it("should throw if neither data nor error are defined", () => {
      expect(() => response(new Context(), statusCodes.OK, {})).to.throw("data xor error must be defined");
    });

    describe("#statusCodes", () => {
      it("should equal statusCodes", () => {
        expect(response.statusCodes).to.equal(statusCodes);
      });
    });

    describe("#data()", () => {
      it("should equal data()", () => {
        expect(response.data).to.equal(data);
      });
    });

    describe("#error()", () => {
      it("should equal error()", () => {
        expect(response.error).to.equal(error);
      });
    });
  });
});
