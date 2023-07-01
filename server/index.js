const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const folderRoutes = require('./routes/folderRoutes');
const fileRoutes = require('./routes/fileRoutes');
const cors = require('cors');
const Folder = require('./models/folderSchema');

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Access-Control-Allow-Origin", "Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true
};

const app = express();

const MONGODB_URI =
  'mongodb+srv://nikhil03:hellskitchen03@cluster0.v5kssag.mongodb.net/gpt-cat?retryWrites=true&w=majority';

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  try {
    const data = await Folder.find();
    res.status(200).json({ data: data });
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/folders', folderRoutes);
app.use('/files', fileRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000, () => {
      console.log('Server is listening on port 5000');
    });
  })
  .catch(err => {
    console.log('Error connecting to MongoDB:', err);
  });
