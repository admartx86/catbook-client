require('dotenv').config();

const express = require('express');
const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/*', (res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(3003, () => {
    console.log('app listening on port 3003 (HTTP)');
});