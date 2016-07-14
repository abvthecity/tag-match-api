# Tag Match API

is a lightweight, thenable tag-matching algorithm that reads a corpus, takes in queries, and returns a transformed object that represent all matches found. (A synchronous method is available as well.)

Motivations: there are many cases where a tag-matching api can be applied. For example, in the case of a university involvement fair platform in which we've catalogued every single student organization with a set of tags. A student using our platform would provide a query of tags that he or she is most interested in, such as `[Engineering, Design, Business]`. These tags intersect for some clubs. Other clubs may only match one tag, and many others none at all. The Tag Match API will isolate those matches and intersections for you.

While this API isn't "smart"—it will not blurry-match—there are many other use cases, especially for searching a catalogue using pre-determined tags. Ideas: NGOs, recipes, companies, movies, books, etc.

## How to use

The Tag Match API is packaged as a class. You may update the `corpus` and the `query` at any time that you wish.

First, let's import the TagMatch API... This API will work on both Node.js and in the browser.

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

Then, you can generate in 2 ways. Asynchronously, or synchronously. If you have a large corpus, the asynchronous, thenable function is more recommended. (The thenable function is just the synchronous function wrapped in a promise.)

```javascript
// async, thenable
matcher.generate().then(function (result) {
  console.log(result);
  // matcher.getResult(); produces the same result here.
});

// sync
matcher.syncGenerate();
var result = matcher.getResult();
var tags = matcher.getResultTags();
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

var result = [
  {
    tags: ['tag1', 'tag5'],
    keys: ['id3'],
  },
  {
    tags: ['tag1', 'tag3'],
    keys: ['id1', 'id2'],
  },
  ...
]

var tags = [['tag1', 'tag3'], ['tag1', 'tag5']];

var matches = ['id1', 'id2', 'id3', ...];

var matchless = [...];
```

Note: result is sorted with greatest `tags` lengths in front, then least `keys` lengths are in front. The only thing that isn't sorted is the order of each item in `keys`, and the `matches` and `matchless`. (You can do that yourself...)

## Conclusion

Thanks for taking a look at this small javascript API!

Dependency: promise.

Authored by Andrew Jiang.
