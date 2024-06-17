const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const userRouter = require('./routes/user');
const ucRouter = require('./routes/uc');
const sipRouter = require('./routes/sip');
const mongoose = require('mongoose');
const searchRouter = require('./routes/search');
const adminRouter = require('./routes/admin');
const setupRouter = require('./routes/setup');

const mongoDB = require('./utils').mongoDB;
mongoose.connect(mongoDB);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB'));
db.once('open', () => {
    console.log('Conexão ao MongoDB realizada com sucesso');
});

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/static', express.static(path.join(__dirname, 'resources')));

app.use('/user', userRouter);
app.use('/uc', ucRouter);
app.use('/sip', sipRouter);
app.use('/search', searchRouter);
app.use('/admin', adminRouter);
app.use('/setup', setupRouter);

module.exports = app;
