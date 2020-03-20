const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const morgan = require('morgan')


//connect to database
mongoose.connect(process.env.mongoUrl || config.database, { useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false});

//on connection
mongoose.connection.on('connected', () => {
    console.log('connected to database '+config.database);
});

//on error
mongoose.connection.on('error', (err) => {
    console.log('database error'+err);
});



const app = express();

app.use(morgan('tiny'));

const users = require('./routes/users');
const posts = require('./routes/posts');

// port number
const port = process.env.PORT || 8080;

app.use(cors());


// set static folder
app.use(express.static(path.join(__dirname, '../public')));

// body parser Middleware
app.use(bodyParser.json());


//passport middleware
app.use(passport.initialize());
app.use(passport.session());


require('./config/passport')(passport);

app.use('/users', users);
app.use('/posts', posts);


// index route
 app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
}) 

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });


//start server
app.listen(port, () => {
    console.log("Server started on port "+port);
})