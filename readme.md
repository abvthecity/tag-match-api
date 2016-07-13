# Tag Match API

is a simple, fast, lightweight, and async matching algorithm that reads a corpus, takes in queries, then return a transformed object that represent all matches found. (An sync algorithm is available as well.)

Motivations: there are many cases that this api can be applied, in order to quickly match a search query with their tags. For example, I am currently working on a university involvement fair platform in which we catalogue every single student organization with a set of tags. A student would provide a query of tags they are most interested in, such as `[Engineering, Design, Business]`. In some clubs, these tags intersect. Other clubs may only match one tag, and many others none at all. The Tag Match API will isolate those matches and intersections for you.

While this API isn't "smart"—it will not blurry-match—there are many use cases for such an API besides my example above. Perhaps you are creating a platform for searching NGOs, recipes, companies, movies, books, etc. based on interests or some form of tags.

## How to use

The Tag Match API is packaged as a class, in which may update the `corpus` and the `query` at any time you wish.

First, import the TagMatch api. Then, create a new tag matcher:

```javascript
var TagMatch = require('./tagmatch');
var corpus = {/* see below for corpus example */}
var query = {/* see below for query example */}
var matcher = new TagMatch();
var matcher2 = new TagMatch(corpus);
var matcher3 = new TagMatch(corpus, query);
```

Notice you can declare the corpus and query in the constructor, or you can do it later...

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

Thanks for taking a look at this small little api!

This api is originally written for javascript. It also has dependencies: async, promise. In the near future I will upload possibly a polymorphic version without dependencies.

Authored by Andrew Jiang.
