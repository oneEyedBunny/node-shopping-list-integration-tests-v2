//import dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');

//
const {app, runServer, closeServer} = require('../server');

// lets us use *expect* & *should* style syntax in our tests
const expect = chai.expect;
const should = chai.should();

// This let's us make HTTP requests in our tests.
chai.use(chaiHttp);

describe ('Recipes', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  //normal test case for get route
    it('should get recipes on GET request', function() {
      return chai.request(app)
        .get('/recipes')
        .then(function(res) {
          expect(res).to.have.status(200);
          res.should.be.json;
          expect(res.body).to.be.a('array');

          expect(res.body.length).to.be.at.least(1);
          // each item should be an object with key/value pairs
          const expectedKeys = ['name', 'ingredients'];
          res.body.forEach(function(item) {
            expect(item).to.be.a('object');
            expect(item).to.include.keys(expectedKeys);
          });
      });
    });

  //normal test case for post route
    it('should add an item on POST request', function() {
      const newItem = {name: 'smores', ingredients: ['chocolate', 'marshmellow', 'graham crackers']};
      return chai.request(app)
        .post('/recipes')
        .send(newItem)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'name', 'ingredients');
          expect(res.body.id).to.not.equal(null);
          expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
          res.body.ingredients.should.be.a('array');
        });
    });

    //  normal test case for PUT request
    it('should update items on PUT request', function() {
      const updateData = {
        name: 'smores',
        ingredients: ['chocolate', 'marshmellow', 'graham crackers']
      };

      return chai.request(app)
        .get('/recipes')
        .then(function(res) {
          updateData.id = res.body[0].id;

          return chai.request(app)
            .put(`/recipes/${updateData.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        });
    });

    // normal test case for delete request
    it('should delete items on DELETE request', function() {
      return chai.request(app)
        .get('/recipes')
        .then(function(res) {
          return chai.request(app)
            .delete(`/recipes/${res.body[0].id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        });
    });




});// close test function
