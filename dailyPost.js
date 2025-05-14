require("dotenv").config();
const { postImage } = require("./index");

(async () => {
  console.log("Running daily NASA post 🚀");
  await postImage();
})();
