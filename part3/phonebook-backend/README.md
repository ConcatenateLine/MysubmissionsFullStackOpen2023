Deploy on render

link:  https://phonebook-backend-zdnc.onrender.com

Unlike when running the app in a development environment, everything is now in the same node/express-backend that runs in localhost:3001. When the browser goes to the page, the file index.html is rendered. That causes the browser to fetch the production version of the React app. Once it starts to run, it fetches the json-data from the address localhost:3001/api/notes.

![The setup for aproduct deployment](./The%20setup%20for%20a%20product%20deployment.png)
