const express = require('express');
const folderController = require('../controllers/folderController');

const router = express.Router();

router.post('/', folderController.createFolder);
router.patch('/:id', folderController.renameFolder);
router.delete('/:id', folderController.deleteFolder);

module.exports = router;
