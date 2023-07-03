const express = require('express');
const fileController = require('../controllers/fileController');

const router = express.Router();

router.post('/', fileController.createFile);
router.patch('/:fileId/:folderId', fileController.renameFile);
router.delete('/:id/:parentId', fileController.deleteFile);

module.exports = router;
