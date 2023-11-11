const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//Roda com node server.js
//adicione suas chave de api do Bedrock no .env (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
//https://docs.aws.amazon.com/bedrock/?icmpid=docs_homepage_ml