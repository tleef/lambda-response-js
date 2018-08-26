/* eslint-env mocha */

import chai from 'chai'
import Context from '@tleef/context-js'

import response, { statusCodes, data, error } from './response'

const expect = chai.expect

describe('response', () => {
  describe('statusCodes', () => {
    it('should expose statusCodes', () => {
      expect(statusCodes).to.deep.equal({
        OK: 200,
        BadRequest: 400,
        Unauthenticated: 401,
        Unauthorized: 403,
        InternalServerError: 500
      })
    })
  })

  describe('data()', () => {
    it('should return an object with data key set to given data', () => {
      const o = {one: 1}

      expect(data(o)).to.deep.equal({data: o})
    })

    it('should be callable without arguments', () => {
      expect(data()).to.deep.equal({data: {}})
    })

    it('should throw if given data is not an object', () => {
      expect(() => data('test')).to.throw('data must be an Object')
    })
  })

  describe('error()', () => {
    it('should return an object with error.message set to given message', () => {
      const message = 'test'

      expect(error(message)).to.deep.equal({error: {message}})
    })

    it('should throw if message is not a String', () => {
      expect(() => error({})).to.throw('message must be a non-empty String')
    })

    it('should throw if message is an empty String', () => {
      expect(() => error('').to.throw('message must be a non-empty String'))
    })
  })

  describe('response()', () => {
    it('should set statusCode to given value', () => {
      const res = response(new Context(), 123, data())

      expect(res.statusCode).to.equal(123)
    })

    it('should set Access-Control-Allow-Origin header to \'*\'', () => {
      const res = response(new Context(), statusCodes.OK, data())

      expect(res.headers['Access-Control-Allow-Origin']).to.equal('*')
    })

    it('should set body to JSON string', () => {
      const ctx = new Context().set('id', '123')
      const o = {one: 1}
      const res = response(ctx, statusCodes.OK, data(o))

      expect(res.body).to.equal(JSON.stringify({
        status_code: statusCodes.OK,
        request_id: ctx.id,
        data: o
      }))
    })

    it('should throw if ctx is not a Context', () => {
      expect(() => response({}, statusCodes.OK, data())).to.throw('ctx must be a Context')
    })

    it('should throw if statusCode is not an Integer', () => {
      expect(() => response(new Context(), '200', data())).to.throw('statusCode must be an Integer')
    })

    it('should throw if data in not an Object', () => {
      expect(() => response(new Context(), statusCodes.OK, {data: 'test'})).to.throw('data must be an Object')
    })

    it('should throw if error in not an Object', () => {
      expect(() => response(new Context(), statusCodes.OK, {error: 'test'})).to.throw('error must be an Object')
    })

    it('should throw if called without body', () => {
      expect(() => response(new Context(), statusCodes.OK)).to.throw('Cannot read property \'data\' of undefined')
    })

    it('should throw if data and error are defined', () => {
      expect(() => response(new Context(), statusCodes.OK, {
        data: {},
        error: {}
      })).to.throw('data xor error must be defined')
    })

    it('should throw if neither data nor error are defined', () => {
      expect(() => response(new Context(), statusCodes.OK, {})).to.throw('data xor error must be defined')
    })

    describe('#statusCodes', () => {
      it('should equal statusCodes', () => {
        expect(response.statusCodes).to.equal(statusCodes)
      })
    })

    describe('#data()', () => {
      it('should equal data()', () => {
        expect(response.data).to.equal(data)
      })
    })

    describe('#error()', () => {
      it('should equal error()', () => {
        expect(response.error).to.equal(error)
      })
    })
  })
})
