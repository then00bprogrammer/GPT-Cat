const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const folderRoutes = require('./routes/folderRoutes');
const fileRoutes = require('./routes/fileRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const cors = require('cors');
const Folder = require('./models/folderSchema');
const User = require('./models/userSchema');
const File = require('./models/fileSchema');
const { Types: { ObjectId } } = mongoose;

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Access-Control-Allow-Origin", "Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true
};

const app = express();

const MONGODB_URI = 'mongodb+srv://nikhil03:hellskitchen03@cluster0.v5kssag.mongodb.net/gpt-cat?retryWrites=true&w=majority';

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get('/:email/:id?', async (req, res) => {
  try {
    const { email, id } = req.params;
    let data;

    if (email) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!id) {
        data = await Folder.find({ user: user._id, name: 'home' });
      } else {
        const folder = await Folder.findOne({ user: user._id, _id: id });
        if (!folder) {
          return res.status(404).json({ error: 'Folder not found' });
        }
        data = [folder];
      }
    } else {
      return res.status(400).json({ error: 'Email parameter is required' });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    res.status(200).json({ folders: data[0].folders, files: data[0].files });
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/', async (req, res) => {
  try {
    const files = await File.find({ view: 'public' })
      .sort({ likes: -1 })
      .limit(10);
    res.json(files);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/createUser', async (req, res) => {
  try {
    const { email } = req.body;
    const user = new User({ email: email });
    await user.save();
    const homeFolder = new Folder({ name: 'home', user: user._id });
    await homeFolder.save();
    const favouritesFolder = new Folder({ user: user._id, name: 'Favourites', files: [], parent: homeFolder._id });
    await favouritesFolder.save();
    homeFolder.folders.push({ name: 'Favourites', id: favouritesFolder._id });
    await homeFolder.save();
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
  }
});

app.post('/bookmarks', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    res.status(201).json(user.bookmarks);
  } catch (error) {
    console.log(error);
  }
});

app.post('/like', async (req, res) => {
  try {
    const { email, id } = req.body;
    const file = await File.findById(id);
    file.likedBy.push(email);
    file.likes = file.likes + 1;
    await file.save();
    res.sendStatus(201);
  } catch (error) {
    console.log('An error occured while adding likes');
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/unlike', async (req, res) => {
  try {
    const { email, id } = req.body;
    const file = await File.findById(id);
    file.likedBy = file.likedBy.filter((likedEmail) => likedEmail != email);
    file.likes = file.likes - 1;
    await file.save();
    res.sendStatus(201);
  } catch (error) {
    console.log('An error occured while adding likes');
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/star', async (req, res) => {
  try {
    const { email, id } = req.body;

    //Modifying public prompt starred array
    const user = await User.findOne({ email: email });
    const file = await File.findById(id);
    file.starredBy.push(email);
    await file.save();

    //Creating new file and pushing it in favourites folder
    console.log('saved');
    const favouritesFolder = await Folder.findOne({ user: user._id, name: 'Favourites' });
    const starredFile = new File({ name: file.name, content: file.content, parent: favouritesFolder._id, user: user._id, referenceFile: file._id });
    await starredFile.save();
    favouritesFolder.files.push({ name: file.name, content: file.content, view: 'private', id: starredFile._id, referenceFile: file._id });
    await favouritesFolder.save();
    res.sendStatus(201);
  } catch (error) {
    console.log('An error occurred while starring the file');
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/unstar', async (req, res) => {
  try {
    const { email, id } = req.body;
    const user = await User.findOne({ email: email });

    const favouritesFolder = await Folder.findOne({ name: 'Favourites', user: user._id });
    favouritesFolder.files = favouritesFolder.files.filter((folderFile) => {
      return folderFile.referenceFile.toString() !== id.toString();
    });
    await favouritesFolder.save();

    await File.findOneAndDelete({ referenceFile: id, user: user._id });

    res.sendStatus(201);
  } catch (error) {
    console.log('An error occurred while unstarring the file');
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.use('/folders', folderRoutes);
app.use('/files', fileRoutes);
app.use('/bookmark', bookmarkRoutes);

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
