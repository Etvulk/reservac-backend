const chai = require('chai');
const chaiHttp = require('chai-http');


const app = require('../index');
const { setupAdminToken, setupLabfToken, setupStudentToken } = require('../utils/helpers/setupTokens')

chai.use(chaiHttp);
const expect = chai.expect;


describe('Trimester', () => {

    let adminToken, labfToken, studentToken;

    before(async () => {
        labfToken = await setupLabfToken();
        adminToken = await setupAdminToken();
        studentToken = await setupStudentToken();
    })

    describe('GET /api/trimestre/todos', () => {
        it('it should get all historical trimesters', (done) => {
            chai.request(app)
                .get('/api/trimestre/todos')
                .set('x-access-token', adminToken)
                .end((err, res) => {
                    const lastTrim = res.body[0].id
                    expect(res).to.have.status(200);
                    expect(res.body).be.a('array');
                    expect(lastTrim).to.have.equal('ENE-MAR2020');
                    done();
                });
        });
    })

    describe('GET /api/trimestre/todos', () => {
        it('it should not pass with unauthorized user', (done) => {
            chai.request(app)
                .get('/api/trimestre/todos')
                .set('x-access-token', studentToken)
                .end((err, res) => {
                    const expected = { unauthorized: 'User need permissions' }
                    expect(res).to.have.status(403);
                    expect(res.body).to.deep.equal(expected);
                    done();
                });
        });
    })



    describe('GET /api/trimestre/ultimo', () => {
        it('it should get the actual trimester or last trimester', (done) => {
            chai.request(app)
                .get('/api/trimestre/ultimo')
                .set('x-access-token', adminToken)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).be.a('array');
                    expect(res.body[0].id).to.have.equal('ENE-MAR2020');
                    done();
                });
        });
    })

    describe('PUT /api/trimestre/ENE-MAR2020', () => {
        it('it should update date of ENE-MAR2020', (done) => {
            let updatedDate = {
                start: "2020-01-2",
                finish: "2020-05-13"
            }
            chai.request(app)
                .put('/api/trimestre/ENE-MAR2020')
                .set('x-access-token', labfToken)
                .send(updatedDate)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).be.a('object');
                    expect(res.body.message).to.have.equal(`Trimestre actualizado`)
                    done();
                });
        });
    });
});