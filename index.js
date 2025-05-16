const express = require("express");
const app = express();
const axios = require("axios");
const fs = require("fs");
require("dotenv").config(); //ENV variables
//Instagram
const { IgApiClient } = require("instagram-private-api");
const Jimp = require("jimp");
const { readFile } = require("fs");
const { promisify } = require("util");
const readFileAsync = promisify(readFile);

//Functions
const postImage = async () => {
  const ig = new IgApiClient();
  try {
    console.log("Posting image to Instagram 🚀👨‍🚀");
    const { url, title, explanation, media_type } = await fethData();
    if (!isAImage(media_type) || (await checkIfPosted(title))) {
      return;
    }
    ig.state.generateDevice("universeapp111");
    await ig.account.login(
      process.env.INSTAGRAM_USERNAME,
      process.env.INSTAGRAM_PASSWORD
    );
    const caption = `${title} \n\n${explanation} \n\n#nasa #javascript #universe #space #astronomy #cosmos #science`;
    const image = await Jimp.read(url);
    await image.writeAsync("image.jpg");

    const published = await ig.publish.photo({
      file: await readFileAsync("image.jpg"),
      caption: caption,
    });
    deleteFile("image.jpg");
    if (published) {
      console.log("Image posted 😍");
      await addToFirebase(title);
    } else {
      console.log("Image not posted 😢");
    }
  } catch (error) {
    console.log("Oh no! Something went wrong: ");
    console.log(error);
  }
};

const isAImage = (media_type) => {
  if (media_type != "image") {
    console.log("Oh no! Today is not a image day, cannot post 🥲");
    return false;
  }
  return true;
};
const fethData = async () => {
  const res = await axios.get(
    `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`
  );
  return res.data;
};

const deleteFile = (path) => {
  try {
    fs.unlinkSync(path);
    console.log("File removed");
  } catch (err) {
    console.error("Something wrong happened removing the file", err);
  }
};

//Firebase
const { db } = require("./firebase");

const addToFirebase = async (title) => {
  await db.collection("nasa-post").add({
    title: title,
    Date: new Date(),
  });
};

const checkIfPosted = async (title) => {
  try {
    const snapshot = await db.collection("nasa-post").get();
    const data = snapshot.docs.map((doc) => doc.data());
    const titles = data.map((item) => item.title);
    if (titles.includes(title)) {
      console.log(`Oh no! ${title} was already posted 😢`);
      return true;
    }
    return false;
  } catch (error) { 
    console.log("Oh no! Something went wrong: ");
    console.log(error);
    return true;
  }
};
//Server
app.use(express.json());

// End points
app.get("/hello", (req, res) => {
  res.send("Hello World!");
  console.log("Saying hello ✌️");
});

app.get("/send", (req, res) => {
  console.log("Hello there 😊....");
  postImage();
  res.send(`POSTING IMAGE AT....${new Date()}`);
});

if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
} //Solo run if this file is run directly


module.exports = { postImage };