const express = require('express');
const sip = require('../controllers/sip');
const multer = require('multer');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const { checkToken, requireLevel, PRODUCER, ADMIN } = require('../auth/auth');

router.use(checkToken);
router.use(requireLevel(PRODUCER));

router.get('/', async (req, res) => {
    try {
        const blob = await sip.export(req.user._id);
        res.type(blob.type);
        res.set('Content-Disposition', 'attachment; filename=export.zip');
        const b = await blob.arrayBuffer();
        res.send(Buffer.from(b));
    }
    catch (e) {
        res.sendStatus(400);
    }
});

router.post('/', upload.single('sip'), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.sendStatus(400);
    }

    try {
        await sip.import(req.user.nivel == ADMIN, req.user._id, file.buffer);
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(400);
    }
});

router.get('/admin', requireLevel(ADMIN), async (req, res) => {
    try {
        const blob = await sip.exportComplete();
        res.type(blob.type);
        res.set('Content-Disposition', 'attachment; filename=export.zip');
        const b = await blob.arrayBuffer();
        res.send(Buffer.from(b));
    }
    catch (e) {
        res.sendStatus(400);
    }
});

router.post('/admin', upload.single('sip'), requireLevel(ADMIN), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.sendStatus(400);
    }

    try {
        await sip.importComplete(file.buffer);
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(400);
    }
});

module.exports = router;
