(function () {
'use strict';

// Establish the root object
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

  // Create a promise to wrap around the synchronous generate alg:
  return new Promise(function (resolve, reject) {
    _this.syncGenerate();
    resolve(_this.getResult());
  });
};

TagMatch.prototype.syncGenerate = function () {
  var query = this._query;
  var corpus = this._corpus;

  // clear all results first
  this.clearResults();

  // quick check to save time
  if (Object.keys(corpus).length == 0 || query.length == 0) {
    return this; // don't continue
  }

  // make references to each object
  var resultRef = {};
  var result = this._result;
  var matches = this._matches;
  var matchless = this._matchless;

  // for each item in the corpus
  Object.keys(corpus).map(function (id) {

    // 1. find intersection
    var arr = query.filter(function (tag) {
      return (corpus[id].indexOf(tag) > -1);
    });

    // 2. attach to references
    if (arr.length > 0) {
      // found match? check if match exists:
      if (typeof resultRef[arr] === 'undefined') {
        result.push({
          tags: arr,
          keys: [],
        });
        resultRef[arr] = result.length - 1;
      }

      result[resultRef[arr]].keys.push(id);
      matches.push(id);
    } else {
      matchless.push(id);
    }
  });

  // sort
  result.sort(function (a, b) {
    var diff = b.tags.length - a.tags.length;
    diff = (diff != 0) ? diff : a.keys.length - b.keys.length;
    return diff;
  });

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

TagMatch.prototype.getResultTags = function () {
  return this._result.map(function (item) {
    return item.tags;
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
  this._result = [];
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
