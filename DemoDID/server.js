const express = require('express');
const open = require('open');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, '.')));

app.listen(port, () => {
  console.log(`DemoDID running on http://localhost:${port}`);
  open(`http://localhost:${port}`);
});