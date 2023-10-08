const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Task Routes', () => {
    let projectId;
    let taskId;

    before((done) => {
        chai
            .request(app)
            .post('/api/projects')
            .send({ title: 'Test Project', description: 'Test Description' })
            .end((err, res) => {
                projectId = res.body.id;
                done();
            });
    });


    it('should create a new task', (done) => {
        chai
            .request(app)
            .post(`/api/tasks/projects/${projectId}/tasks`)
            .send({ title: 'Test Task', description: 'Test Description' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('title', 'Test Task');
                taskId = res.body.id;
                done();
            });
    });


    it('should fetch tasks by project ID', (done) => {
        chai
            .request(app)
            .get(`/api/tasks/projects/${projectId}/tasks`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.length.above(0);
                done();
            });
    });


    it('should fetch a single task by task ID', (done) => {
        chai
            .request(app)
            .get(`/api/tasks/${taskId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('title', 'Test Task');
                done();
            });
    });


    it('should update an existing task', (done) => {
        chai
            .request(app)
            .put(`/api/tasks/${taskId}`)
            .send({ title: 'Updated Task', description: 'Updated Description' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('title', 'Updated Task');
                done();
            });
    });


    it('should delete an existing task', (done) => {
        chai
            .request(app)
            .delete(`/api/tasks/${taskId}`)
            .end((err, res) => {
                expect(res).to.have.status(204);
                done();
            });
    });


});
