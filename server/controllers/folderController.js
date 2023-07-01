const Folder = require('../models/folderSchema');

const createFolder = async (req, res) => {
  try {
    const { name, path } = req.body;
    const folders = path.split('/').filter(folder => folder.trim() !== '');
    folders.unshift("home");
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

    const newFolder = new Folder({ name, parent: parentFolder });

    if (parentFolder) {
      parentFolder.folders.push(newFolder);
      await parentFolder.save();
    }

    await newFolder.save();

    res.status(201).json({ message: 'Folder created successfully' });
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const renameFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const folder = await Folder.findByIdAndUpdate(id, { name }, { new: true });

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    res.status(204).json({ message: 'Folder renamed successfully', folder });
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

    await deleteFolderAndContents(id);
    await Folder.deleteOne({ _id: id });

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
