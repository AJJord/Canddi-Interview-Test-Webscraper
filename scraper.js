/*~~~Requirements~~~*/
const request = require('request');
const fs = require('fs');

/*~~~Global Variables~~~*/
//Get regexs used for searching webpage from the json file
var regexpress = JSON.parse(fs.readFileSync('scraperRegexs.json'));

//Object to store data taken from the website
var InfoObj = {};
//Generate object using regexpress object
for (let key in regexpress){
	InfoObj[key] =[];
}

//take email address
var email = 'tim@canddi.com';

//Extract web address from email and format
const website = 'http://' + email.split('@')[1];


/*~~~Functions~~~*/
/*
Summary:   Scrapes data elementText string using a regular expression stores the data in an array
Arguments: The string to scrape data from | Array to store scraped data in | regex used to identify data
*/
function scrapeRegex(elementText, storageArray, regex){
	//store array of regex matches
	var matchlist = elementText.match(regex);
	//iterate over array
	for ( var i in matchlist){
		//If match isn't already included, add to array
		if (!storageArray.includes(matchlist[i])) storageArray.push(matchlist[i]);
	}
};

/*
Summary:   Generic data collecting function for a request. Won't look for other pages, focuses purely getting data.
Arguments: Error info (when applicable) | Response object | retrieved data (string)
*/
function genericDataSearch(err, response, body){
	//Scrape info for each key in infoObj
	for (let key in InfoObj){
		scrapeRegex(body,InfoObj[key],new RegExp(regexpress[key][0],regexpress[key][1]));
	}
}

/*~~~Page request and scraping~~~*/
request(website,function (err, response, body){
	if(err) return console.error(err);

	genericDataSearch(err, response, body);

	//Print object to console
	console.log(InfoObj);
});
