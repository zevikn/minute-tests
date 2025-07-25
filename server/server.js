const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
//const VALID_TYPES = ['play', 'pause', 'seeked', 'scroll']; //need to add it for type validation

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../client')));

app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  next();
});

app.post('/api/event', (req, res) => {
  //need to add type validation (for example) here (in order for all the tests to pass):
  //const { type } = req.body;
  //if (!VALID_TYPES.includes(type)) {
  //  return res.status(400).send({ ok: false, error: 'Invalid type' }); 
  //}
  
  console.log('📩 Event received:', req.body);
  res.status(200).send({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`📺 Server is running at http://localhost:${PORT}`);
});
