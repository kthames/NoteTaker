const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile
} = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
    readFromFile('./Develop/db/db.json')
        .then((data) => res.json(JSON.parse(data)));
});

// DELETE Route for a specific tip
notes.delete('/:notes_id', (req, res) => {
  const noteId = req.params.notes_id;

  readFromFile('./Develop/db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all tips except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteId);
      
      // Save that array to the filesystem
      writeToFile('./Develop/db/db.json', result);

      // Respond to the DELETE request
      res.json(`Note ${noteId} has been deleted 🗑️`);
    });
});

  // POST Route for a new note
notes.post('/', (req, res) => {
    console.log(req.body);
  
    const { title, text } = req.body;
  
    if (req.body) {
      const newNote = {
        title,
        text,
        id: uuidv4(),
      };
  
      readAndAppend(newNote, './Develop/db/db.json');
      res.json(`Note added successfully`);
    } else {
      res.error('Error in adding note');
    }
  });
  
  module.exports = notes;
  
