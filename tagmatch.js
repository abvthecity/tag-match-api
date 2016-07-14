var Promise = require('promise');
var async = require('async');

function TagMatch(corpus, query) {
  this._corpus = {};
  this._query = [];
  this._result = {};
  this._matches = [];
  this._matchless = [];
  this.setCorpus(corpus);
  this.setQuery(query);
};

TagMatch.prototype.generate = function () {
  var _this = this;

  return new Promise(function (resolve, reject) {
    var query = _this._query;
    var corpus = _this._corpus;

    // quick check to save time
    if (Object.keys(corpus).length == 0 || query.length == 0) {
      _this._result = {}; // no possible results
      _this._matchless = [];

      resolve({
        result: {},
        keys: [],
        matches: [],
        matchless: [],
      });
    }

    // start async alg
    var finalResult = {};
    var matches = [];
    var matchless = [];

    // asyncronously process each item in the corpus, then save.
    async.map(Object.keys(corpus), processCorpusItems, resolveCorpus);

    function processCorpusItems(id, cbMap) {
      // filter the tags, the push results
      async.filter(corpus[id], filterTags, pushResults);

      function filterTags(tag, cbFilter) {
        cbFilter(null, query.indexOf(tag) > -1);
      }

      function pushResults(err, arr) {
        if (err) reject(err);
        arr.sort(); // safety

        if (arr.length > 0) { // found matches
          if (typeof finalResult[arr] !== 'object')
            finalResult[arr] = [];
          finalResult[arr].push(id);
          matches.push(id);
        } else matchless.push(id);

        cbMap(null, id);
      }
    }

    function resolveCorpus(err) {
      if (err) reject(err);
      _this._result = finalResult;
      _this._matches = matches.sort();
      _this._matchless = matchless.sort();

      resolve({
        result: _this.getResult(),
        keys: _this.getResultKeys(),
        matches: _this.getMatches(),
        matchless: _this.getMatchless(),
      });
    }

  });
};

TagMatch.prototype.syncGenerate = function () {
  // not recomended for large corpus!
  var query = this._query;
  var corpus = this._corpus;

  // quick check to save time
  if (Object.keys(corpus).length == 0 || query.length == 0) {
    _this._result = {}; // no possible results
    return this; // don't continue
  }

  // start sync alg
  var finalResult = {};
  var matches = [];
  var matchless = [];

  Object.keys(corpus).map(function (id) {
    var arr = corpus[id].filter(function (tag) {
      return (query.indexOf(tag) > -1);
    }).sort();
    if (arr.length > 0) { // found matches
      if (typeof finalResult[arr] !== 'object')
        finalResult[arr] = [];
      finalResult[arr].push(id);
      matches.push(id);
    } else {
      matchless.push(id);
    }
  });

  this._result = finalResult;
  this._matches = matches.sort();
  this._matchless = matchless.sort();

  return this;
};

TagMatch.prototype.setCorpus = function (corpus) {
  this._corpus = corpus || this._corpus;
  return this;
};

TagMatch.prototype.setQuery = function (query) {
  this._query = query || this._query;
  this._query.sort();
  return this;
};

TagMatch.prototype.getResult = function () {
  return this._result;
};

TagMatch.prototype.getResultKeys = function () {
  return Object.keys(this._result).map(function (item) {
    return item.split(',');
  }).sort(function (a, b) {
    return b.length - a.length;
  });
};

TagMatch.prototype.getMatches = function () {
  return this._matches;
};

TagMatch.prototype.getMatchless = function () {
  return this._matchless;
};

TagMatch.prototype.getCorpus = function () {
  return this._corpus;
};

TagMatch.prototype.getQuery = function () {
  return this._query;
};

/* —————— export —————— */

module.exports = TagMatch;
