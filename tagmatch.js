(function () {
'use strict';

// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
var root = typeof self === 'object' && self.self === self && self ||
  typeof global === 'object' && global.global === global && global ||
  this;

// include dependencies.
var Promise = root != null && root.promise || typeof require == 'function' && require('promise');

// init class constructor
function TagMatch(corpus, query) {
  this.clearAll();
  this.setCorpus(corpus);
  this.setQuery(query);
};

TagMatch.prototype.generate = function () {
  var _this = this;

  return new Promise(function (resolve, reject) {
    _this.syncGenerate();
    resolve({
      result: _this.getResult(),
      keys: _this.getResultKeys(),
      matches: _this.getMatches(),
      matchless: _this.getMatchless(),
    });
  });
};

TagMatch.prototype.syncGenerate = function () {
  this.clearResults(); // clear firts
  var query = this._query;
  var corpus = this._corpus;

  // quick check to save time
  if (Object.keys(corpus).length == 0 || query.length == 0) {
    this._result = {}; // no possible results
    return this; // don't continue
  }

  // start sync alg
  var result = this._result;
  var matches = this._matches;
  var matchless = this._matchless;

  Object.keys(corpus).map(function (id) {
    var arr = corpus[id].filter(function (tag) {
      return (query.indexOf(tag) > -1);
    });

    arr.sort();
    if (arr.length > 0) { // found matches
      if (typeof result[arr] !== 'object')
        result[arr] = [];
      result[arr].push(id);
      matches.push(id);
    } else {
      matchless.push(id);
    }
  });

  matches.sort();
  matchless.sort();

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

TagMatch.prototype.clearResults = function () {
  this._result = {};
  this._matches = [];
  this._matchless = [];
  return this;
};

TagMatch.prototype.clearAll = function () {
  this.clearResults();
  this._corpus = {};
  this._query = [];
  return this;
};

/* —————— export —————— */

//export mechanism taken from async.js

// Node.js
if (typeof module === 'object' && module.exports) {
  module.exports = TagMatch;
}

// AMD / RequireJS
else if (typeof define === 'function' && define.amd) {
  define([], function () {
    return TagMatch;
  });
}

// included directly via <script> tag
else {
  root.TagMatch = TagMatch;
}

})();
