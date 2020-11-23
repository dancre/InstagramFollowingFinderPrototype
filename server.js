const express = require('express');
const path = require('path');
const cors = require('cors');
const followingFinder = require('./followingFinder.js');

const app = express();
app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());
app.options('*', cors());


// TODO = false to try and hit the Instagram API (if your account specified is not blocked...)
const useMocks = false;

app.post('/users', async (req, res) => {
  let followingsByUsername = []
  for(const userName of req.body.usernames) {
    let result = useMocks 
      ? await followingFinder.getFollowingMock(userName)
      : await followingFinder.getFollowing(userName)
    followingsByUsername.push({[userName]: result})
  }
  return res.json(followingsByUsername);
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080);