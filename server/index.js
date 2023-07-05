const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const folderRoutes = require('./routes/folderRoutes');
const fileRoutes = require('./routes/fileRoutes');
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
    const files = await File.find({})
      .sort({ likes: -1 })
      .limit(10);
    res.json(files);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/createUser',async(req,res)=>{
  try{
    const { email } = req.body;
    const user = new User({email:email});
    await user.save();
    const homeFolder = new Folder({ name: 'home', user: user._id });
    await homeFolder.save();
    res.status(201).json({'message':'User created successfully'});
  } catch(error){
    console.log(error);
  }
});

app.post('/bookmarks',async(req,res)=>{
  try{
    const { email } = req.body;
    const user = await User.findOne({email:email});
    res.status(201).json(user.bookmarks);
  } catch(error){
    console.log(error);
  }
})

app.post('/bookmark',async(req,res)=>{
  try{
    const { name,queries, response, email } = req.body;
    let conversation=[]
    for (let i=0;i<queries.length;i++){
      conversation.push({
        query:queries[i],
        response:response[i]
      })
    }
    const user = await User.findOne({email:email});
    user.bookmarks.push({name:name,conversation:conversation});
    await user.save();
    res.status(201).json({'message':'Bookmarked successfully'});
  } catch(error){
    console.log(error);
  }
});

app.delete('/bookmark',async(req,res)=>{
  try{
    const {email,id} = req.body;
    const user = await User.findOne({email:email});
    user.bookmarks = user.bookmarks.filter((bookmark)=>bookmark._id.toString()!=id);
    await user.save();
    res.sendStatus(204);
  } catch(error){
    console.log('An error occured while deleting the bookmark');
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/like',async(req,res)=>{
  try{
    const {email,id} = req.body;
    const file = await File.findById(id);
    file.likedBy.push(email);
    file.likes=file.likes+1;
    await file.save();
    res.status(201).json({'message':'Liked successfully'});
  } catch(error){
    console.log('An error occured while adding likes');
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/unlike',async(req,res)=>{
  try{
    const {email,id} = req.body;
    const file = await File.findById(id);
    file.likedBy=file.likedBy.filter((likedEmail)=>likedEmail!=email);
    file.likes=file.likes-1;
    await file.save();
    res.status(201).json({'message':'Unliked successfully'});
  } catch(error){
    console.log('An error occured while adding likes');
    res.status(500).json({ error: 'Internal server error' });
  }
})


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
