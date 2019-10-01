const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

mongoose.connect(
  'mongodb+srv://aircnc:Ewky4oDdrrWp2mVC@aircnc-d8eag.mongodb.net/aircnc?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(express.json());
app.use(routes);

app.listen(3333);
