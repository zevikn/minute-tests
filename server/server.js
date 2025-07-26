const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
//const VALID_TYPES = ['play', 'pause', 'seeked', 'scroll']; //TODO: add it for type validation

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../client')));

app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  next();
});

app.post('/api/event', (req, res) => {  
  //TODO: add validation for missing or invalid fields (to pass all tests)
  //const { userId, type, videoTime, timestamp } = req.body;	
  //if (!userId || !type || typeof videoTime !== 'number' || !timestamp) {
  //	return res.status(400).json({ ok: false, error: 'Missing or invalid fields' });
  //}
	
  //TODO: add type validation (to pass all tests):  
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
