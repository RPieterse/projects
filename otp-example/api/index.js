const express = require('express');
require('dotenv').config()
const cors = require('cors');

const port = process.env.PORT

// Initialize DB
require('./database/initialize').connect();

// Routers
const indexRouter = require('./routes/otp');

// App
const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/otp', indexRouter);

// Test Route 
app.get('/', function(_, res) {
  res.send('Success!')
});

// Catch all
app.get('*', function(_, res) {
  res.status(404).send("Not Found.")
});

// Start server
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
