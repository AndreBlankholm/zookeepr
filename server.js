
const express = require('express');
const { animals } = require('./data/animals.json');  //creating a route that the front-end can request data from


const PORT = process.env.PORT || 3001; // Heroku sets its enviroment variable call proces.env.PORT. and if not, default to 3001

const app = express();                       // setting up the server so we can say app.get instead of express()


function filterByQuery(query, animalsArray) {  //----------------------- req.query is multifaceted, often combining multiple parameters
  let personalityTraitsArray = []; 

  // Note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;

  if (query.personalityTraits) {  //(is not null)
      //Save the pesonalityTraits as an dedicated array
      // If personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits]; // if strings, convert to an array of strings [] syntax
      } else {
        personalityTraitsArray = query.personalityTraits; // if it was an arry already
      }
  }  

   // Loop through each trait in the personalityTraits array:
   personalityTraitsArray.forEach(trait => {   //trait name is defined by the dev
    // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one 
      // of the traits when the .forEach() loop is finished.
    filteredResults = filteredResults.filter(
      animal => animal.personalityTraits.indexOf(trait) !== -1
    );

  });


  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  return filteredResults;
}

function findById(id, animalsArray) {
  const results = animalsArray.filter(animal => animal.id === id)[0];
  return results;
}


//-------------------------- PAY ATTENTION TO THE ORDER OF THE ROUTES ---------------------------

app.get('/api/animals', (req, res) => {   // the get() method requires two arguments. The first is a string that describes the route the client will have to fetch from. 
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  } else {
    res.send(404);
  }
  
  res.json(results);
  console.log(results);
});                              


app.get('/api/animals/:id', (req,res) => {           //---------------------------- req.param is specific to a single property, often intended to retrieve a single record.
  const result = findById(req.params.id, animals);
  if (result) {                                      //if statment put in incase no result is found there will be a 404 error thrown
    res.json(result);
  }
})


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });
