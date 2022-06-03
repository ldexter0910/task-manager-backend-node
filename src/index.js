const express = require('express');
const userRouter = require('./routers/users.route');
const taskRouter = require('./routers/tasks.route');
require('./db/mongoose');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log(`Server started listening on https://localhost:${port}`);
});