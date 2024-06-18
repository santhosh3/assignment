require('dotenv').config();
const express = require("express");
const userRouter = require('./src/routes/routes');
const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// testing API
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "REST APIs are working",
  });
});

//Routes come here
app.use('/', userRouter)

//If any route name is not matching then route not found
app.use('*', (req, res, next) => {
    res.status(404).json({
        status: false,
        message: 'Route not found'
    })
})

const PORT = process.env.APP_PORT || 4000;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

/*

// To initilize sequelize
npx sequelize-cli init

// To generate a model
npx sequelize-cli model:generate --name userModel --attributes userName:string,email:string,password:string

// To create a database
npx sequelize-cli db:create

// To migrate tables to DB
npx sequelize-cli db:migrate

// To revert migration
npx sequelize-cli db:migrate:undo

*/

