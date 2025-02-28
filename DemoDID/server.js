const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, '.')));

app.listen(port, async () => {
  console.log(`DemoDID running on http://localhost:${port}`);
  const open = (await import('open')).default;
  open(`http://localhost:${port}`);
});