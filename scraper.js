/*~~~Requirements~~~*/
const request = require('request');
const fs = require('fs');
const readline = require('readline');
const cheerio = require('cheerio');

/*~~~Global Variables~~~*/
//Get regexs used for searching webpage from the json file
var regexpress = JSON.parse(fs.readFileSync('scraperRegexs.json'));

//Object to store data taken from the website
var InfoObj = {};
//Generate object using regexpress object
for (let key in regexpress){
	InfoObj[key] =[];
}




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
function genericDataSearch(body){
	//Scrape info for each key in infoObj
	for (let key in InfoObj){
		scrapeRegex(body,InfoObj[key],new RegExp(regexpress[key][0],regexpress[key][1]));
	}
}

/*~~~Page request and scraping~~~*/
//Get email address
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var email = "example@canddi.com";//Set default value

rl.question('Enter an email address (default {0}): '.replace('{0}', email), function (answer){
	if (answer.trim() != ""){//if input given
		email = answer;
		//Get email RegEx
		let emailRegExp = new RegExp(regexpress.email[0], regexpress.email[1]);
		//Test if string is valid
		if (!emailRegExp.test(email)){
			rl.close();
			return console.log('Input does not match formatting for an email address');
		}
	}
	rl.close();

	//Extract web address from email and format
	const website = 'http://' + email.split('@')[1];

	request(website,function (err, response, body){
		if(err) return console.error(err);
		//Perform a pass with plain html
		genericDataSearch(body);
		//perform a pass with visible text extracted by cheerio
		const $ = cheerio.load(body);
		$('body').each(function(){
			let tagText = $(this).text();
			// console.log(tagText);
			genericDataSearch(tagText);
		});
	});
});

process.on('exit', (code)=>{
	console.log(InfoObj)
});