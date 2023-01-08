const mongoose = require('mongoose');

const dbUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'task-app'

mongoose.connect(`${dbUrl}/${dbName}`).catch(e => {
    console.log(e);
});