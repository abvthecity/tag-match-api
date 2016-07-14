var TagMatch = require('./../tagmatch');

var corpus = {
  id1: ['tag1', 'tag2', 'tag3'],
  id2: ['tag1', 'tag3', 'tag4'],
  id3: ['tag1', 'tag4', 'tag5'],
};

var query = ['tag1', 'tag3', 'tag5'];

var matcher = new TagMatch(corpus, query);

var time = Date.now();

matcher.generate().then(({ result, keys, matches, matchless }) => {
  var timeElapsed = Date.now() - time;
  console.log('TIME ELAPSED:', timeElapsed / 1000);
  console.log('RESULT:', result);
  console.log('KEYS:', keys);
  console.log('MATCHES:', matches);
  console.log('MATCHLESS:', matchless);
  console.log('QUERY:', matcher.getQuery());
  console.log('CORPUS:', matcher.getCorpus());
});
