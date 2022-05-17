const express = require('express');

const PORT = process.env.PORT || 3001; // Heroku sets its enviroment variable call proces.env.PORT. and if not, default to 3001

const app = express();// setting up the server so we can say app.get instead of express()


const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');


//both of these app.use if you plan tp accept POST data!!--------------
app.use(express.urlencoded({ extended: true }));  // parse incoming string or array data
app.use(express.json());  // parse incoming JSON data
//---------------------------------------------------------------------

app.use(express.static('public'));  // makes the links work for images, css, and script links

// Use apiRoutes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});


