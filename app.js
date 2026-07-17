const express = require("express");
const connectDB = require("./db");
const Email = require('./models/Email');
const app = express();
const port = 3000;
app.set("view engine", "ejs")
app.use(express.static('public'))

connectDB();



app.get('/', (req, res) => {
    res.render('home', { title: 'Email Assistant', content: 'krish' })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
