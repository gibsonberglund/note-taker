const express = require('express');
const path = require('path');
const api = require('./db/db.json');
const bodyParser = require('body-parser');
const { randomUUID } = require('crypto');
const fs = require('fs');



const PORT = process.env.PORT || 3001

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.use(bodyParser.json())

// get index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
});

// get notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
});

// get db.json
app.get('/api/notes', (req, res) => res.json(api));

// post db.json
app.post('/api/notes', (req, res) =>{

  console.log(req.body)

//Destructuring the request body and creating local variables

if (req.body.title && req.body.text) {
  // Variable for the object we will save
  const newNote = {
    title:req.body.title,
    text:req.body.text,
    note_id: randomUUID(),
  };

  console.log({body:req.body,note:newNote})

  const response = {
    status: 'success',
    body: newNote,
  };

  //add note to api
  //const noteString = JSON.stringify(newNote);

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = [JSON.parse(data)];

      // Add a new review
      parsedNotes.push(newNote);

      // Write updated reviews back to the file
      fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedNotes),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated notes!')
      );
    }
  });

  console.log(response);

  res.status(201).json(response);
} else {
  res.status(500).json('Error saving note');
}
});


app.delete('/api', (req, res) =>
    res.sendFile(path.join(__dirname, './db/db.json'))
    );

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);