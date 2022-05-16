const fs = require('fs');
const path = require('path');

const express = require('express');
const { animals } = require('./data/animals.json');  //creating a route that the front-end can request data from


const PORT = process.env.PORT || 3001; // Heroku sets its enviroment variable call proces.env.PORT. and if not, default to 3001

const app = express();    // setting up the server so we can say app.get instead of express()



//***-----At that point, the data will be run through a couple of functions to take the raw data transferred over HTTP and convert it to a JSON object.

app.use(express.urlencoded({ extended: true })); //// parse incoming string or array data
//both of these app.use if you plan tp accept POST data!!
app.use(express.json());    // parse incoming JSON data

app.use(express.static('public'));  // makes the links work for images, css, and script links
//***------------------------------------------------------------------------------------------------------------------------------------------------------


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
    )

  })

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
  const results = animalsArray.filter(animal => animal.id === id)[0];        //finding one parameter by Id
  return results;
}


function createNewAnimal(body, animalsArray) {  //Here, we just created a function that accepts the POST route's req.body value and the array we want to add the data to.
  console.log(body);

  const animal = body;  //change body(post in json to animal)

  animalsArray.push(animal);    

  fs.writeFileSync(                                   // synchronous version of fs.writeFile() and doesn't require a callback function
    path.join(__dirname, './data/animals.json'),      
    JSON.stringify({ animals: animalsArray }, null, 2)  //|KEEPS DATA FORMATTED| we need to save the JavaScript array data as JSON, so we use JSON.stringify() to convert it.
  );                                                    //he null argument means we don't want to edit any of our existing data; if we did, we could pass something in there. The 2 indicates we want to create white space between our values to make it more readable.

  return body;
};

// Add Validation to Our Data ---------------------------------------------------------------------

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
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



//-----------------------------------------------------------------------------------------



app.post('/api/animals', (req, res) => {  // POST requests, we can package up data, typically as an object, and send it to the server.
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


app.get('/', (req, res) => {   //root route
  res.sendFile(path.join(__dirname, './public/index.html'));  //index.html to be served from our Express.js server.
  //res.sendFile displays the file we want to send back to the client.
});

app.get('/animals', (req, res) => {  
  res.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));  //( * )is catching wrong Url
});







app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);  //  
});