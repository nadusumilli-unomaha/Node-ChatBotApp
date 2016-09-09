# ChatBotApp
This is a chat application in Express 4 and MongoDB.

## Initial Steps
- Install MongoDB and start mongod
- Run npm install to install all dependencies
- Install nodemon through npm install -g nodemon
- Execute nodemon app.js / node app.js to run the application
- Navigate to http://localhost:3000
- The application logs are saved to MongoDB collection named logs
- Execute db.logs.find(); to query the logs after running mongo (./mongo from git bash)
- Alternately execute db.logs.find().pretty(); for better readable format

## Installing Updates
- Login to server using SSH
```
$ ssh username@45.55.200.53
```
- Go to application code directory and Pull latest code from GitHub
```
$ cd /var/www/chatapp/code
$ git pull
```
- This will prompt you for GitHub username and password, if not you may not have necessary privileges
...Install any new npm dependencies and remove invalid dependencies
```
$ npm install --production
$ npm prune --production
```
- Restart Nginx
```
$ sudo service nginx restart
```
