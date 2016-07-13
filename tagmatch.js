var Promise = require('promise');
var async = require('async');

function TagMatch(corpus, query) {
  this._corpus = corpus || {};
  this._query = (query) ? query.sort() : [];
  this._result = {};
  this._matches = [];
  this._matchless = [];
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
      resolve({ result: {}, keys: [], matches: [], matchless: [], });
      return; // don't continue
    }

    //start async alg
    var finalResult = {};
    var matches = [];
    var matchless = [];

    // for each item in the corpus
    async.map(Object.keys(corpus),
      function (id, cbMap) {
        var comparer = clone(corpus[id]); // deep copy

        // filter the tags
        async.filter(comparer,
          function (tag, cbFilter) {
            cbFilter(null, query.indexOf(tag) > -1);
          },

          function (err, arr) {
            if (err) reject(err);
            arr.sort(); // safety

            if (arr.length > 0) { // found matches
              if (typeof finalResult[arr] !== 'object')
                finalResult[arr] = [];
              finalResult[arr].push(id);
              matches.push(id);
            } else {
              matchless.push(id);
            }

            cbMap(null, id);
          });
      },

      function (err, end) {
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

      });
  });
};

TagMatch.prototype.syncGenerate = function () {
  let query = this._query;
  let corpus = this._corpus;

  // quick check to save time
  if (Object.keys(corpus).length == 0 || query.length == 0) {
    _this._result = {}; // no possible results
    return this; // don't continue
  }

  // start sync alg
  let finalResult = {};
  let matches = [];
  let matchless = [];
  Object.keys(corpus).map(function (id) {
    let comparer = clone(corpus[id]); // deep copy
    let arr = comparer.filter(function (tag) {
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
  this._query = (query) ? query.sort() : this._query;
  return this;
};

TagMatch.prototype.getResult = function () {
  return clone(this._result);
};

TagMatch.prototype.getResultKeys = function () {
  return clone(Object.keys(this._result)).sort(function (a, b) {
    return b.length - a.length;
  });
};

TagMatch.prototype.getMatches = function () {
  return clone(this._matches);
};

TagMatch.prototype.getMatchless = function () {
  return clone(this._matchless);
};

/* ———–—— general functions —————— */

function clone(obj) { // enables deep copy
  if (obj === null || typeof obj !== 'object') return obj;
  var temp = obj.constructor(); // give temp the original obj's constructor
  for (var key in obj)
    temp[key] = clone(obj[key]);
  return temp;
}

/* —————— export —————— */

module.exports = TagMatch;
