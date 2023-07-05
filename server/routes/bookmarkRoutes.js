const express = require('express');
const bookmarkController = require('../controllers/bookmarkController');

const router = express.Router();

router.post('/', bookmarkController.addBookmark);
router.delete('/', bookmarkController.deleteBookmark);

module.exports = router;