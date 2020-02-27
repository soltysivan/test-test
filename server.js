const superagent = require('superagent');
const express = require('express');
const PORT = process.env.PORT || 5000;

const app = express();


app.use(express.static('dist'));

app.get('/profile', (req, res) => {
  console.log(req.query);
  superagent.get('https://graph.facebook.com/v3.1/me')
    .query({access_token: req.query.access_token, fields: 'name,email,last_name,first_name,picture'})
    .then(responce => {
      console.log(responce);
      res.send(responce)
    })
    .catch(console.error);
});

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}!`);
});
