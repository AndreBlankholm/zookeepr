const router = require('express').Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');



//-------------------------- PAY ATTENTION TO THE ORDER OF THE ROUTES ---------------------------

router.get('/animals', (req, res) => {   // the get() method requires two arguments. The first is a string that describes the route the client will have to fetch from. 
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }  
    res.json(results);
  
    console.log(results);
  });                              
  
  
  router.get('/animals/:id', (req,res) => {           //---------------------------- req.param is specific to a single property, often intended to retrieve a single record.
    const result = findById(req.params.id, animals);
    if (result) {                                      //if statment put in incase no result is found there will be a 404 error thrown
      res.json(result);
    } else {
      res.send(404);
    }
  
  });
  
  
  
  //-----------------------------------------------------------------------------------------
  
  
  
  router.post('/animals', (req, res) => {  // POST requests, we can package up data, typically as an object, and send it to the server.
    console.log(req.body);                  // console.log(resq.body) 
  
     // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();  // add id to animals string data and set data at the end of the JSON array
  
     // if any data in req.body is incorrect, send 400 error back
     if (!validateAnimal(req.body)) {
      res.status(400).send('The animal is not properly formatted.');
    } else {
      const animal = createNewAnimal(req.body, animals);
      res.json(animal);
    }
    
  });


  

  module.exports  = router;  // exporting the new router