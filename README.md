# Task Scheduler Service - Lemonade Home Assignment

## Prerequisite:


## Run on local environment
### Installation
* make sure you have nodejs installed.
* clone repo into a folder:
* if running a local database:
  * with your preferred MySQl tool - run the following query:
    * `CREATE SCHEMA scheduler;
      CREATE TABLE scheduler.Tasks ( id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, url VARCHAR(255), time DATETIME, success BOOLEAN DEFAULT FALSE )`
  * go to project folder and edit /config/config.json file to look like :
  * `{
    "development": {
    "username": <your db username>,
    "password": <your db password>,
    "database": "scheduler",
    "host": "localhost",
    "dialect": "mysql",
    "port": 3306 }}`
* if connecting to remote database (slower)
  * go to project folder and edit /config/config.json file 
    * change `development` to `temp`
    * change `remote` to `development`

* in terminal go to project folder and:
* run `npm install`
* run `npm run build`
* run `npm start`
* service should run now

### Debugging
* with your preferred IDE add the project as nodejs with main file to run ../dist/src/index.js 

### Testing 
* the service should run on PORT 3000 so there will be two end points
* POST `http://localhost:3000/task`
  * body example:
  * `{
    "url": "https://webhoook.com/t",
    "hours":0,
    "minutes": 0,
    "seconds": 20
    }`
* GET `http://localhost:3000/task/<id>` e.g: `http://localhost:3000/task/456`


************************************************
************************************************
## About the assignment

### Assumptions
* service is designed to handle future tasks. immediate tasks (few seconds) are the edge case.
* making sure a task was fired once and only once if more critical than the exact time it was supposed to fire (such accuracy is hard to achieve at scale).
* task added with past date - is fired in the next dispatch.
* service is agnostic to webhook response. fail or success - if webhook is called - task is completed.

### Suggested improvements - Code
* unit tests using Mocha or JEST
* integration tests
* tasks with low time to fire - insert to cache before db ( requires additional unique id @ runtime and changes to database)
* create a new table for old tasks and clear old tasks from Tasks table periodically  
* better logs
* break down scheduler into a separate package

### Suggested improvements - @Scale
* use in memory data store (e.g. Redis) so if service restarts - in memory data is not lost.
* split the service into small services
  * data service - responsible for storing and providing tasks as quick as possible. the only one that communicates with persistent db and in memory db.
  * api service - provides two end points with validation and communicates with the data service.
  * scheduler - fetches tasks from data service and passes them onto the dispatcher queue.
  * dispatcher queue -  holds queue of tasks.
  * dispatch worker - fetching tasks from queue and executing them.
* scale horizontally
  * load balancer for api calls.
  * multiple data services responsible for smaller sizes of data.
  * multiple fetchers - each one connected to a difference data service.
  * multiple dispatch workers and priority queues.
  * the system can auto scale based on the quantity of messages in the queue.


### Class design of current implementation
![alt text](https://github.com/gILisH/scheduler/blob/main/scheduler.drawio.png?raw=true)
