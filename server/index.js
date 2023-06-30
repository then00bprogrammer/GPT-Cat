const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Access-Control-Allow-Origin", "Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true
};

const app = express();

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));


const MONGODB_URI =
  `mongodb+srv://nikhil03:hellskitchen03@cluster0.v5kssag.mongodb.net/gpt-cat?retryWrites=true&w=majority`;

app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    console.log('connected')
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
