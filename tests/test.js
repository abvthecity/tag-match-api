var TagMatch = require('./../tagmatch');

var corpus = {};
var query = [];

for (var i = 0; i < 1000; i++) {
  corpus['id' + i] = [];
  for (var j = 0; j < 2000; j++) {
    if (Math.round(Math.random() * 0.6) == 1) {
      corpus['id' + i].push('tag' + j);
    }
  }
}

for (var j = 0; j < 2000; j++) {
  if (Math.round(Math.random() * 0.502) == 1) {
    query.push('tag' + j);
  }
}

var startTime = Date.now();
var asyncTimeElapsed = 0;
var syncTimeElapsed = 0;

// test 1, async
var matcher = new TagMatch(corpus, query);
matcher.generate().then(function ({ result, keys, matches, matchless }) {
  asyncTimeElapsed = Date.now() - startTime;
  console.log('RESULTS:', keys.length);
  console.log('MATCHES:', matches.length);
  console.log('MATCHLESS:', matchless.length);

  printTimes();
},

function (err) {
  console.error(err);
});

// test 2, sync
var matcher2 = new TagMatch(corpus, query);
matcher2.syncGenerate();
syncTimeElapsed = Date.now() - startTime;

function printTimes() {
  console.log('SYNC TIME ELAPSED:', syncTimeElapsed, 'ms');
  console.log('ASYNC TIME ELAPSED:', asyncTimeElapsed, 'ms');
}
