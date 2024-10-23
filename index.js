const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const cors = require("cors");  // Import cors
const https = require('https');
const PORT = process.env.PORT || 3000;
const app = express();
const fs = require('fs');
const path = require('path');

app.use(cors({
  origin: '*'  // Allow all origins
}));
app.use(express.json());
app.use(authRouter);

const DB =
  "mongodb+srv://rivaan:test123@cluster0.lcq2qaw.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((e) => {
    console.log(e);
  });

// const options = {
//   key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
//   cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
//   // pfx: fs.readFileSync(path.join(__dirname, 'cert', 'star-cameoindia-24.pfx'))
// };

// https.createServer(options, app).listen(PORT, () => {
//   console.log(`Server running in mode at https://localhost:${PORT}`);
// });
// console.log(`Server is running on port ${PORT}`);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`connected at port ${PORT}`);
});
