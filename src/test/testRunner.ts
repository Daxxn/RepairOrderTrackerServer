import assert from 'assert';
import simpleTest from './simpleRequest';

describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
  describe('Request testing', () => simpleTest);
});
