const User = require('../models/userSchema');

const addBookmark = async (req, res) => {
    try {
        const { name, link, email } = req.body;
        const user = await User.findOne({ email: email });
        user.bookmarks.push({ name: name, link: link });
        await user.save();
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
    }
}

const getBookmarks = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        res.status(201).json(user.bookmarks);
    } catch (error) {
        console.log(error);
    }
}


const deleteBookmark = async (req, res) => {
    try {
        const { email, id } = req.body;
        const user = await User.findOne({ email: email });
        user.bookmarks = user.bookmarks.filter((bookmark) => bookmark._id.toString() != id);
        await user.save();
        res.sendStatus(204);
    } catch (error) {
        console.log('An error occured while deleting the bookmark');
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports={
    addBookmark,
    getBookmarks,
    deleteBookmark,
}