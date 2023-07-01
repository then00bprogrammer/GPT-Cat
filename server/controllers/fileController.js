const Folder = require('../models/folderSchema');

const createFile = async (req, res) => {
  try {
    const { name, path, content } = req.body;
    const folders = path.split('/').filter(folder => folder.trim() !== '');
    let parentFolder = null;

    for (const folderName of folders) {
      let folder = await Folder.findOne({ name: folderName, parent: parentFolder });

      if (!folder) {
        folder = new Folder({ name: folderName, parent: parentFolder });
        await folder.save();

        if (parentFolder) {
          parentFolder.folders.push(folder);
          await parentFolder.save();
        }
      }

      parentFolder = folder;
    }

    const newFile = { name, content };
    parentFolder.files.push(newFile);
    await parentFolder.save();

    res.status(201).json({ message: 'File created successfully' });
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const renameFile = async (req, res) => {
  try {
    const { folderId, fileId } = req.params;
    const { name } = req.body;

    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const file = folder.files.id(fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    file.name = name;

    await folder.save();

    res.status(204).json({ message: 'File renamed successfully', file });
  } catch (error) {
    console.error('Error renaming file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id, parentId } = req.params;
    const folder = await Folder.findById(parentId);
    let files = folder.files;
    files = files.filter((file) => file._id != id);
    folder.files = files;
    await folder.save();
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createFile,
  renameFile,
  deleteFile,
};
