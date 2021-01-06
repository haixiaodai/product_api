
var express = require('express');
const port = process.env.PORT || 3001;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const productrouter=require('./routes/products');
const salesrouter=require('./routes/sales')

var app = express();
app.use(express.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productrouter);
app.use('/sales', salesrouter);

//Handle errors
app.use((req, res, next) => {
  const error = new Error();
  error.message = "Not found";
  error.status = 404;
  next(error);
});

//If error not defined, return 500
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message
  });
});

module.exports = app;

app.listen(port, () => {
  console.log(`server running on port ${port}`)
});