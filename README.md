# How Sad Was I

Just a goofy little program to calculate sentiment between tweets.

Heavily inspired by:

* https://github.com/IBM-Bluemix/ziggy
* https://github.com/watson-developer-cloud/personality-insights-nodejs

## Usage

You'll need to create a profile for IBM Watson. Then, create a file called `.env`, with the folling environment variables:

```
PERSONALITY_INSIGHTS_USERNAME=<your_username>
PERSONALITY_INSIGHTS_PASSWORD=<your_password>
```

Then:

```
npm install
node fetch.js # requires your Twitter Archive's tweets.csv
node generate.js
```
