import express from "express";
import bodyParser from "body-parser";
import path from "path";

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

  
  

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });