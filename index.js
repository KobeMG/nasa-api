const express = require('express');
const app = express();
const axios = require('axios');
const fs = require('fs');
require('dotenv').config(); //ENV variables
//Instagram 
const { IgApiClient } = require('instagram-private-api');
const Jimp = require("jimp");
const { readFile } = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(readFile);

//Functions
const postImage = async () => {
    const ig = new IgApiClient();
    try {
        console.log("Logging in...");
        ig.state.generateDevice('universeapp111');
        await ig.account.login(process.env.INSTAGRAM_USERNAME, process.env.INSTAGRAM_PASSWORD);
        const { url, title, explanation } = await fethData();
        const caption = `${title} \n\n${explanation} \n\n #nasa #javascript #universe`;
        const image = await Jimp.read(url);
        await image.writeAsync('image.jpg');

        const published = await ig.publish.photo({
            file: await readFileAsync("image.jpg"),
            caption: caption
        });
        deleteFile('image.jpg');
        if (published) {
            console.log("Image posted 😍");
        } else {
            console.log("Image not posted 😢");
        }

    } catch (error) {
        console.log("Oh no! Something went wrong: ");
        console.log(error);
    }
}

const fethData = async () => {
    const res = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`);
    return res.data;
}

const deleteFile = (path) => {
    try {
        fs.unlinkSync(path)
        console.log('File removed')
    } catch (err) {
        console.error('Something wrong happened removing the file', err)
    }
};

//Server
app.use(express.json());
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    //postImage();
});

// End points
app.get('/hello', (req, res) => {
    res.send('Hello World!');
    console.log("Sayng hello ✌️");
});

app.get("/send", (req, res) => {
    console.log("Hello there 😊, posting image to Instagram....");
    postImage();
    res.send(`POSTING IMAGE AT....${new Date()}`);
});