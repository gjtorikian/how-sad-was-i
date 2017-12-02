'use strict';

var fs = require('fs');
var csv = require("fast-csv")
require('dotenv').config();

const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

const personalityInsights = new PersonalityInsightsV3({
  username: process.env.PERSONALITY_INSIGHTS_USERNAME,
  password: process.env.PERSONALITY_INSIGHTS_PASSWORD,
  version_date: '2016-10-19',
});

var twenty_sixteen = new Date('2016-01-01');
var twenty_seventeen = new Date('2017-01-01');

var dates_to_tweets = {
  "2017": {},
  "2016": {}
}

csv
 .fromPath('tweets.csv')
 .on("data", function(data) {
   var date = new Date(data[3]);
   var month = date.getMonth() + 1;
   var text = data[5];
   if (date >= twenty_sixteen && date < twenty_seventeen) {
     if (dates_to_tweets["2016"][month] === undefined) {
       dates_to_tweets["2016"][month] = { content_items: [], count: 0 };
     }
     dates_to_tweets["2016"][month].content_items.push( { content: text.replace('[^(\\x20-\\x7F)]*','') })
     dates_to_tweets["2016"][month].count += 1;
   }
   else if (date >= twenty_seventeen) {
     if (dates_to_tweets["2017"][month] === undefined) {
       dates_to_tweets["2017"][month] = { content_items: [], count: 0 };
     }
     dates_to_tweets["2017"][month].content_items.push( { content: text.replace('[^(\\x20-\\x7F)]*','') })
     dates_to_tweets["2017"][month].count += 1;
   }
 })
 .on("end", function() {
   const twenty_sixteen_params = {
     content_items: []
   };
   const twenty_seventeen_params = {
     content_items: []
   };

   for (var i = 1; i < 13; i++) {
     (function(month){
       twenty_sixteen_params.content_items = dates_to_tweets["2016"][month].content_items;

       personalityInsights.profile(twenty_sixteen_params, function(err, insight) {
         if (err) {
           console.error(err);
         } else {
           insight.count = dates_to_tweets["2016"][month].count
           insight.date = "2016_" + month;
           fs.writeFileSync("data/" + insight.date + ".json", JSON.stringify(insight, null, 2));
         }
      });
     }(i));

     (function(month){
       twenty_seventeen_params.content_items = dates_to_tweets["2017"][month].content_items;

       personalityInsights.profile(twenty_seventeen_params, function(err, insight) {
         if (err) {
           console.error(err);
         } else {
           insight.count = dates_to_tweets["2017"][month].count
           insight.date = "2017_" + month;
           fs.writeFileSync("data/" + insight.date + ".json", JSON.stringify(insight, null, 2));
         }
      });
     }(i));
   }
 });
