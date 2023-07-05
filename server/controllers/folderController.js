const mongoose = require('mongoose');
const { Types: { ObjectId } } = mongoose;
const Folder = require('../models/folderSchema');
const User = require('../models/userSchema');

const createFolder = async (req, res) => {
  try {
    const { name, path, email } = req.body;
    const user = await User.findOne({ email: email });
    const folders = path.split('/').filter(folder => folder.trim() !== '');
    folders.unshift('home');
    let parentFolder = null;

    for (const folderName of folders) {
      let folder = await Folder.findOne({ name: folderName, parent: parentFolder, user: user._id });

      if (!folder) {
        folder = new Folder({ name: folderName, parent: parentFolder, user: user._id });
        await folder.save();

        if (parentFolder) {
          parentFolder.folders.push({ name: folderName, id: folder });
          await parentFolder.save();
        }
      }

      parentFolder = folder;
    }

    const newFolder = new Folder({ name, parent: parentFolder, user: user._id });
    if (parentFolder) {
      parentFolder.folders.push({ name: name, id: newFolder });
      await parentFolder.save();
    }

    await newFolder.save();

    const respFolder={
      name:newFolder.name,
      id:newFolder.id
    }

    res.status(201).json(respFolder);
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const renameFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = await User.findOne({email:email});

    const folder = await Folder.findOneAndUpdate({ _id: id, user:user._id }, { name:name });
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    
    if (folder.parent) {
      const parentFolder = await Folder.findById(folder.parent);
      if (parentFolder) {
        parentFolder.folders.forEach((subfolder) => {
          if (subfolder.id.toString() === folder._id.toString()) {
            subfolder.name = name;
          }
        });
        await parentFolder.save();
      }
    }

    res.sendStatus(204);
  } catch (error) {
    console.error('Error renaming folder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteFolderAndContents = async (folderId) => {
  const folder = await Folder.findById(folderId);

  if (!folder) return;

  for (const folderId of folder.folders) {
    await deleteFolderAndContents(folderId);
  }

  await Folder.deleteMany({ parent: folderId });
};

const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const folder = await Folder.findById(id); 

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const parentFolder = await Folder.findById(folder.parent);

    if (!parentFolder) {
      return res.status(404).json({ error: 'Parent folder not found' });
    }

    parentFolder.folders = parentFolder.folders.filter((f) => f.id.toString() !== folder._id.toString());
    await parentFolder.save();

    await deleteFolderAndContents(id);
    await Folder.findByIdAndDelete(id);

    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createFolder,
  renameFolder,
  deleteFolder,
};
