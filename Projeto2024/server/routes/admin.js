const express = require('express');
const router = express.Router();
const User = require('../controllers/user');
const { PRODUCER } = require('../auth/auth');

router.post('/promote/:id', async (req, res) => {
    try {
        await User.promote(req.params.id, PRODUCER);
        res.status(200).send();
    } catch (_) {
        res.status(500).send();
    }
});

module.exports = router;
