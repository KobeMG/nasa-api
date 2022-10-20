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

//CRON:
var cron = require('node-cron');
//create a shedule every day at 7AM
cron.schedule('0 7 * * *', () => {
    console.log('Good morning 😊, posting image...');
    postImage();
});

//create a shedule every 3 minute


const postImage = async () => {
    const ig = new IgApiClient();
    try {
        console.log("Logging in...");
        ig.state.generateDevice('universeapp111');
       // await ig.simulate.preLoginFlow();
        const user = await ig.account.login(process.env.INSTAGRAM_USERNAME, process.env.INSTAGRAM_PASSWORD);

        const { hdurl, title, explanation } = await fethData();
        const pathImage = hdurl;
        const caption = `${title} \n\n ${explanation} \n\n #NASA #NODEJS #SPACE #HELLOWORLD`;
        const image = await Jimp.read(pathImage);
        const writeImage = await image.writeAsync('image.jpg');

        const published = await ig.publish.photo({
            file: await readFileAsync("image.jpg"),
            caption: caption
        });
        deleteFile('image.jpg');
        if (published) {
            console.log("Image posted 😍");  
        }else{
            console.log("Image not posted 😢");
        }
       
    } catch (error) {
        console.log("Oh no! Something went wrong: ");
        console.log(error);
    }
}

//Server
app.use(express.json());
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    //postImage();
});

const fethData = async () => {
    const res = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`);
    const data = res.data;
    return data;
}

const deleteFile = (path) => {
    try {
        fs.unlinkSync(path)
        console.log('File removed')
    } catch (err) {
        console.error('Something wrong happened removing the file', err)
    }
};

// End points
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.post("/send", (req, res) => {
    console.log("POSTING....");
    postImage();
    res.send(`POSTING IMAGE AT....${new Date()}`);
});