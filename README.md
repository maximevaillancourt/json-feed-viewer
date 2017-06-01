# JSON Feed Viewer

This is a webapp that allows to view JSON feeds. See it in action here: https://json-feed-viewer.herokuapp.com/

## Getting Started

### Prerequisites

The app was tested on the following configuration:

- Ubuntu 16.04
- npm 3.8.9
- Node v6.2.0
- Redis 3.2.9

### 0. Install Redis

Install a local Redis server by following [these instructions](https://redis.io/topics/quickstart).

### 1. Clone the repo

```
git clone https://github.com/maximevaillancourt/json-feed-viewer.git
```

### 2. Install dependencies

```
cd json-feed-viewer && npm install
```

### 3. Start the server

```
npm start
```

## Deployment

The app is currently "Heroku deployment"-ready. Feel free to deploy it through other means.

## Contributing

Simply fork this repo, then create a new pull request. Thanks for contributing! :)

## Built With

* [feed2json.org](https://feed2json.org/) - Used to convert RSS & Atom feeds into JSON
* [Node](https://nodejs.org/en/) - JavaScript runtime based on Chrome's V8
* [Express](https://expressjs.com/) - Minimalist web framework
* [Bootswatch](https://bootswatch.com/) - Free themes for Bootstrap

## Authors

* **Maxime Vaillancourt** - *Initial work* - [maximevaillancourt](https://github.com/maximevaillancourt)

See also the list of [contributors](https://github.com/maximevaillancourt/json-feed-viewer/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Andrew Chilton ([@andychilton](https://twitter.com/andychilton)) for developing feed2json.org
* John Gruber ([@gruber](https://twitter.com/gruber)) for the initial exposure
* Manton Reece ([@manton2](https://twitter.com/manton2)) & Brent Simmons ([@brentsimmons](https://twitter.com/brentsimmons)) for writing out the initial JSON Feed spec
