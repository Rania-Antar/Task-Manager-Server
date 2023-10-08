const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Project Routes', () => {

  it('should create a new project', (done) => {
    chai
      .request(app)
      .post('/api/projects')
      .send({ title: 'Test Project', description: 'Test Description' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('title', 'Test Project');
        done();
      });
  });

  it('should update an existing project', (done) => {
    chai
      .request(app)
      .put('/api/projects/1')
      .send({ title: 'Updated Project', description: 'Updated Description' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('title', 'Updated Project');
        done();
      });
  });

  it('should delete an existing project', (done) => {
    chai
      .request(app)
      .delete('/api/projects/1') 
      .end((err, res) => {
        expect(res).to.have.status(204);
        done();
      });
  });

});
