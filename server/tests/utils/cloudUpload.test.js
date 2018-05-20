import { expect } from 'chai';
import cloudUpload from '../../utils/cloudUpload';

/**
 * Test cloudUpload function
 */

describe('Test suite for cloud upload function', () => {
  it('should return error for invalid url', (done) => {
    const fn = async () => {
      const result = await cloudUpload.uploadImage('wrongsrclink');
      if (result) {
        expect(result.code).to.equal('ENOENT');
        done();
      }
    };
    fn();
  });
});
