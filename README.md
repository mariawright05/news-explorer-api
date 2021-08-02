# News Explorer App

![NewsExplorer Screenshot](https://github.com/mariawright05/news-explorer-frontend/src/images/app-graphic.jpg)

This project is a service where users can search for news articles and save them to their profiles.

The app can be run at <https://mariawright05.github.io/news-explorer-frontend/> and will access the api at <https://api-news-explorer-mmw.herokuapp.com/api>

## About the Project

This website has these main features:

* When a user enters a keyword in the search bar, a request to the News API service, where it finds all the relevant articles over the last week, and display a list of cards for each of them.

* If a user creates an account, they have the ability to save and display articles they have saved in a special section of the website.

## Front-End

The website consists of 2 pages: the home pages where users can seach for recent news articles, and a saved news page that is only available to logged in users. There are 3 popup windows: registration, registration success, and login. Front-End Repo: <https://github.com/mariawright05/news-explorer-frontend/>

### Back-End Technology Features

The back-end is a RESTful API built with Express.js and MongoDB. The infrastructure for hosting production code was launched on AWS cloud server.

Two entities were created in this project: `user` and `article`.

The following 4 routes are included for `article`:

```bash
# returns information about the logged-in user (email and name)
GET /users/me

# returns all articles saved by the user
GET /articles

# creates an article with the passed
# keyword, title, text, date, source, link, and image in the body
POST /articles

# deletes the stored article by _id
DELETE /articles/articleId
```

The following 2 routes are created for `user`:

```bash
# creates a user with the passed
# email, password, and name in the body
POST /signup

# checks the email and password passed in the body
# and returns a JWT
POST /signin
```
