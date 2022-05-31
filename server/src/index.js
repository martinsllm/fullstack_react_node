require('dotenv').config()
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(express.json())

app.use(morgan('dev'))

app.use(cors());
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
	
	next();
});

app.use(require('./routes/routes'))

app.use(require('./middlewares/exceptions'))

app.listen(process.env.PORT || 8080);