# Scout

An auditing tool that helps reveal CSS dragons lurking within your stylesheets.

## Getting Started
```
npm install scout-css --save-dev
```

## Usage
```js
const scout = require('scout-css');
const cssFile = 'public/css/app.min.css'

scout(cssFile).then(results => {
  // Do stuff with the results!
});
```


## Development (Web app)

Install all the things:
```
npm install
```

Fire it up:
```
npm run dev
```

Go to [http://localhost:3000/](http://localhost:3000/)
