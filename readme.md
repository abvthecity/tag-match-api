# Tag Match API

is a lightweight, asynchronous matching algorithm that reads a corpus, takes in queries, and returns a transformed object that represent all matches found. (A synchronous method is available as well.)

Motivations: there are many cases where a tag-matching api can be applied. For example, I am currently working on a university involvement fair platform in which we've catalogued every single student organization with a set of tags. A student using our platform would provide a query of tags that he or she is most interested in, such as `[Engineering, Design, Business]`. These tags intersect for some clubs. Other clubs may only match one tag, and many others none at all. The Tag Match API will isolate those matches and intersections for you.

While this API isn't "smart"—it will not blurry-match—there are many other use cases, especially for searching a catalogue using pre-determined tags. Ideas: NGOs, recipes, companies, movies, books, etc.

## How to use

The Tag Match API is packaged as a class. You may update the `corpus` and the `query` at any time that you wish.

First, let's import the TagMatch API...

```javascript
var TagMatch = require('./tagmatch');
var corpus = {/* see below for corpus example */}
var query = {/* see below for query example */}
var matcher = new TagMatch();
var matcher2 = new TagMatch(corpus);
var matcher3 = new TagMatch(corpus, query);
```

Notice how you can declare the corpus and query in the constructor, or how you can do it later...

```javascript
matcher.setCorpus(corpus).setQuery(query);
```

Then, you can generate in 2 ways. Asynchronously, or synchronously. If you have a large corpus, async is probably better.

```javascript
// async
matcher.generate().then(function ({ result, keys, matches, matchless }) {
  // result = see below for example of result
  // keys = array of keys of the results
  // matches = every id that did match
  // matchless = every id that didn't match
});

// sync
matcher.syncGenerate();
var result = matcher.getResult();
var keys = matcher.getResultKeys();
var matches = matcher.getMatches();
var matchless = matcher.getMatchless();
```

## Data models

One requirement for all of this to work is that you follow the data models closely. The structure is pretty rigid. You also have to manage duplicate data yourself.

```javascript
// INPUT

var corpus = {
  id1: ['tag1', 'tag2', 'tag3', ...],
  id2: ['tag1', 'tag3', 'tag4', ...],
  id3: ['tag1', 'tag4', 'tag5', ...],
  ...
}

var query = ['tag1','tag3','tag5', ...];

// OUTPUT

var result = {
  ['tag1', 'tag3']: ['id1', 'id2'],
  ['tag1', 'tag5']: ['id3'],
  ...
}

var keys = [['tag1', 'tag3'], ['tag1', 'tag5']];

var matches = ['id1', 'id2', 'id3', ...];

var matchless = [...];
```

## Conclusion

Thanks for taking a look at this small javascript API!

Dependencies: async, promise.

Authored by Andrew Jiang.
