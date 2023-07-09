const express = require('express');
const fileController = require('../controllers/fileController');

const router = express.Router();

router.patch('/changeVisibility', fileController.changeVisibility);
router.delete('/:id/:email', fileController.deleteFile);
router.patch('/:id/', fileController.renameFile);
router.post('/', fileController.createFile);

module.exports = router;
