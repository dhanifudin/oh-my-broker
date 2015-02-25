# oh-my-broker

## Requirements
* NodeJS
* bower module
* grunt module
* mongodb
* mysql > 5.6

## Configuration
```
cp database.json.sample database.json
```
Please change username and password for mysql

## Installation
* Please deploy mysql schema before run the application /sql/track.sql
```bash
git clone https://github.com/dhanifudin/oh-my-broker.git
cd oh-my-broker
npm install && bower install
grunt dev
node app.js
```
