const express = require('express');
const async = require('async');
const pg = require('pg');
const { Pool } = require('pg');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.set('transports', ['polling']);

const port = process.env.PORT || 4000;

io.sockets.on('connection', (socket) => {
  socket.emit('message', { text: 'Welcome!' });

  socket.on('subscribe', (data) => {
    socket.join(data.channel);
  });
});

const pool = new pg.Pool({
  connectionString: 'postgres://postgres:postgres@db/postgres'
});

async.retry(
  { times: 1000, interval: 1000 },
  (callback) => {
    pool.connect((err, client, done) => {
      if (err) {
        console.error('Waiting for db');
      }
      callback(err, client);
    });
  },
  (err, client) => {
    if (err) {
      return console.error('Giving up');
    }
    console.log('Connected to db');
    getVotes(client);
  }
);

function getVotes(client) {
  client.query('SELECT vote, COUNT(id) AS count FROM votes GROUP BY vote', [], (err, result) => {
    if (err) {
      console.error('Error performing query: ' + err);
    } else {
      const votes = collectVotesFromResult(result);
      io.sockets.emit('scores', JSON.stringify(votes));
    }

    setTimeout(() => {
      getVotes(client);
    }, 1000);
  });
}

function collectVotesFromResult(result) {
  const votes = { a: 0, b: 0 };

  result.rows.forEach((row) => {
    votes[row.vote] = parseInt(row.count);
  });

  return votes;
}

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  next();
});

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'views/index.html'));
});

server.listen(port, () => {
  console.log('App running on port ' + port);
});
