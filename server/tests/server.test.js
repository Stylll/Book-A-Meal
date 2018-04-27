import request from 'supertest';
import { expect } from 'chai';
import app from '../server';

/**
 * Test for server script
 */

describe('Test suite for entry server file', () => {
  it('should return status code 200', (done) => {
    request(app)
      .get('/api/v1')
      .end((err, resp) => {
        expect(resp.status).to.equal(200);
        done();
      });
  });

  it('should return error code 404', (done) => {
    request(app)
      .get('/api/v')
      .end((err, resp) => {
        expect(resp.status).to.equal(404);
        done();
      });
  });
});
