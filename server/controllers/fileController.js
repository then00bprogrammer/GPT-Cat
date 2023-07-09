const User = require('../models/userSchema');
const Folder = require('../models/folderSchema');
const File = require('../models/fileSchema');
const Category = require('../models/categorySchema');

const createFile = async (req, res) => {
  try {
    const { name, path, content, email } = req.body;

    const user = await User.findOne({ email: email });
    const folders = path.split('/').filter(folder => folder.trim() !== '');
    folders.unshift("home");
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

    const newFile = new File({ name, content, view: 'private', parent: parentFolder._id, user: user._id });
    await newFile.save();
    const respFile = {
      name: newFile.name,
      content: newFile.content,
      id: newFile.id,
    }

    parentFolder.files.push({ id: newFile, name: name, content: content, view: 'private' });
    await parentFolder.save();

    res.status(201).json(respFile);
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const renameFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = await User.findOne({ email: email });

    const file = await File.findOneAndUpdate({ _id: id, user: user._id }, { name: name });
    if (!file) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    if (file.parent) {
      const parentFolder = await Folder.findById(file.parent);
      if (parentFolder) {
        parentFolder.files.forEach((folderfile) => {
          if (folderfile.id.toString() === file._id.toString()) {
            folderfile.name = name;
          }
        });
        await parentFolder.save();
      }
    }

    res.sendStatus(204);
  } catch (error) {
    console.error('Error renaming file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id, email } = req.params;
    const user = await User.findOne({ email: email });
    const file = await File.findById(id);

    if (file.referenceFile) {
      const referenceFile = await File.findById(file.referenceFile);
      referenceFile.starredBy = referenceFile.starredBy.filter((starredEmail) => starredEmail != email);
      await referenceFile.save();
    }
    const folder = await Folder.findById(file.parent);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    folder.files = folder.files.filter((file) => file.id.toString() != id.toString())
    await folder.save();
    await File.findByIdAndDelete(id);

    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const changeVisibility = async (req, res) => {
  try {
    const { id, category, link, authorName } = req.body;
    const file = await File.findById(id);
    if (file.view === 'public') file.view = 'private';
    else{
      file.view = 'public';
      file.category=category;
      file.link=link;
      file.publicAuthorName=authorName;
    }
    await file.save();

    if (file.parent) {
      const parentFolder = await Folder.findById(file.parent);
      if (parentFolder) {
        parentFolder.files.forEach((folderfile) => {
          if (folderfile.id.toString() === file._id.toString()) {
            folderfile.view = file.view;
          }
        });
        await parentFolder.save();
      }
    }
    res.sendStatus(204);
  } catch (error) {

  }
};

module.exports = {
  createFile,
  renameFile,
  deleteFile,
  changeVisibility
};
