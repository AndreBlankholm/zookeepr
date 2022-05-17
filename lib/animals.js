const fs = require("fs");
const path = require("path");

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  let filteredResults = animalsArray;  // Note that we save the animalsArray as filteredResults here:
  if (query.personalityTraits) {
    //(is not null)
    //Save the pesonalityTraits as an dedicated array
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];  // if strings, convert to an array of strings [] syntax
    } else {
      personalityTraitsArray = query.personalityTraits; // if it was an arry already
    }

    console.log(personalityTraitsArray);


    personalityTraitsArray.forEach(trait => { // Loop through each trait in the personalityTraits array:
      //trait name is defined by the dev
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
  }

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
  const results = animalsArray.filter((animal) => animal.id === id)[0]; //finding one parameter by Id
  return results;
}


function createNewAnimal(body, animalsArray) {
  //Here, we just created a function that accepts the POST route's req.body value and the array we want to add the data to.
  console.log(body);

  const animal = body; //change body(post in json to animal)

  animalsArray.push(animal);

  fs.writeFileSync(
    // synchronous version of fs.writeFile() and doesn't require a callback function
    path.join(__dirname, "../data/animals.json"),
    JSON.stringify({ animals: animalsArray }, null, 2) //|KEEPS DATA FORMATTED| we need to save the JavaScript array data as JSON, so we use JSON.stringify() to convert it.
  ); //he null argument means we don't want to edit any of our existing data; if we did, we could pass something in there. The 2 indicates we want to create white space between our values to make it more readable.

  return animal;
}

// Add Validation to Our Data ---------------------------------------------------------------------

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== "string") {
    return false;
  }
  if (!animal.species || typeof animal.species !== "string") {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== "string") {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}


module.exports = {
  filterByQuery,
  findById,
  createNewAnimal,
  validateAnimal
};