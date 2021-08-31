import chai from 'chai';
import chaiHttp from 'chai-http';
import assert from 'assert';
import app from '../app';

chai.use(chaiHttp);
const expect = chai.expect;

// export default describe('Basic GET Test', () => {
//   chai
//     .request(app)
//     .get('/', (err, res) => {
//       assert.ifError(err);
//       assert.notEqual(res.body, null, 'Body is not null??');
//     })
//     .send();
// });

export default describe('Basic GET Test', () => {
  chai
    .request('http://localhost:2000')
    .get('/')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
    });
});
