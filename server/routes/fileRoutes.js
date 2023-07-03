const express = require('express');
const fileController = require('../controllers/fileController');

const router = express.Router();

router.post('/', fileController.createFile);
router.patch('/:id/', fileController.renameFile);
router.delete('/:id', fileController.deleteFile);

module.exports = router;
