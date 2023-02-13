const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static('public'));

//grabs html
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

//grabs html for the notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//happens when the user goes the the notes.html.
app.get('/api/notes', (req, res) => {
    //console.log("getting notes...");
    res.sendFile(path.join(__dirname, 'db/notes.json'));
    //I just send over the json file to the index.js
});

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;

    fs.readFile('./db/notes.json', 'utf-8', (error, data) => {
        if(error) {
            console.log(error.message);
            return
        }

        //this allows me to see if there is anything inside the notes.json file so i don't delete anything
        let objects;
        try {
            objects = JSON.parse(data);
        } 
        catch (error) {
            console.log(error.message);
            objects = [];
        }
        
        if(req.body) {
            const newNote = {
                title,
                text,
                id: Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
            };
            objects.push(newNote);
            console.log(objects);
            fs.writeFile('./db/notes.json', JSON.stringify(objects) + "\n", (error) => {
                if(error) {
                    console.log(error.message);
                }
            });
        }
    })

    

   


});

//when the user pressed the delete button for a specific note
app.delete('/api/notes/:id', (req, res) => {
    console.log("deleting...");
    const id = req.params.id;
    console.log("ID: ", id);
    fs.readFile('./db/notes.json', (err, data) => {
        if(err) {
            console.log("error with reading file");
        }

        let content = JSON.parse(data);

        content = content.filter((item) => item.id != id);

        fs.writeFile('./db/notes.json', JSON.stringify(content), (err) => {
            if(err) {
                console.log("error with deleteing the object");
            }
        });
    });
});


app.listen(PORT, () => 
    console.log("App listening at http://localhost:3001")
);

