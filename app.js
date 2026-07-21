const express = require("express");
const connectDB = require("./db");
const Email = require('./models/Email');
const app = express();
const port = 3000;
app.set("view engine", "ejs")
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

connectDB();



app.get('/', (req, res) => {
    res.render('home', { title: 'Email Assistant', currentPage: 'home', content: 'krish' })
})

app.get('/emails', async (req, res) => {
    try {
        const email = await Email.find().sort({ createdAt: -1 });
        res.render('emails', { title: 'Inbox', currentPage: 'emails', emails: email })
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Error loading emails');
    }
})

app.get('/emails/compose', (req, res) => {
    res.render('compose', { title: 'Compose Email', currentPage: 'compose' })
})

app.get('/emails/:id/edit', async (req, res) => {
    try {
        const email = await Email.findById(req.params.id);
        if (!email) {
            return res.status(404).send('Email not found');
        }
        res.render('edit', { title: 'Edit Email', email: email, currentPage: 'emails' });
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Error loading email');
    }
})

app.get('/emails/:id', async (req, res) => {
    try {
        const email = await Email.findById(req.params.id);
        if (!email) {
            return res.status(404).send('Email not found');
        }
        res.render('email', { title: email.subject, email: email, currentPage: 'emails' });
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Error loading email');
    }

})

app.post('/emails', async (req, res) => {
    try {
        await Email.create({
            to: req.body.to,
            subject: req.body.subject,
            body: req.body.body,
            status: 'sent'
        });
        res.redirect('/emails');
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Error saving email');
    }


})

app.post('/emails/:id/edit', async (req, res) => {
    try {
        await Email.findByIdAndUpdate(req.params.id, {
            to: req.body.to,
            subject: req.body.subject,
            body: req.body.body
        });
        res.redirect('/emails');
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Error updating email');
    }
})

app.post('/emails/:id/delete', async (req, res) => {
    try {
        await Email.findByIdAndDelete(req.params.id);
        res.redirect('/emails');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error deleting email');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})



