/*~~~Requirements~~~*/
const request = require('request');
const fs = require('fs');
const readline = require('readline');
const cheerio = require('cheerio');

/*~~~Global Variables~~~*/
//Get regexs used for searching webpage from the json file
var regexpress = JSON.parse(fs.readFileSync('scraperRegexs.json'));
var urlRegExp = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
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
Arguments: Text to collect data from
*/
function genericDataSearch(body){
	//Scrape info for each key in infoObj
	//Perform a pass with plain html
	for (let key in InfoObj) scrapeRegex(body,InfoObj[key],new RegExp(regexpress[key][0],regexpress[key][1]));
	//perform a pass with visible text extracted by cheerio
	let $c = cheerio.load(body);
	$c('body').each(function(){
		let tagText = $c(this).text();
		for (let key in InfoObj) scrapeRegex(tagText,InfoObj[key],new RegExp(regexpress[key][0],regexpress[key][1]));
	});
}

/*
Summary:   Takes a link scraped from a href attribute, formats it and makes a request to find more information.
Arguments: The scraped href value | the root URL of the site incase a relatve link is given
*/
function reqHref(hrefVal, rootURL){
	if (!urlRegExp.test(hrefVal)){//Tests if a relative link is given (eg. /contact/)
		hrefVal.startsWith('/')        //ternary if statement
			? 'no / needs to be added' //True result
			: (hrefVal = '/'+hrefVal); //False result
		hrefVal = rootURL + hrefVal;
	}
	request(hrefVal, function(hreferr, hrefresponse, hrefbody){//get contact page
		if(hreferr) return console.error(hreferr);
		console.log(hrefVal,' Accessed.');
		genericDataSearch(hrefbody);
	});
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
			return console.log('Input does not match format of an email address');
		}
	}
	rl.close();

	//Extract web address from email and format
	const website = 'http://www.' + email.split('@')[1];

	request(website,function (err, response, body){
		if(err) return console.error(err);

		//Scrape website
		genericDataSearch(body);

		const $ = cheerio.load(body);
		//Search links for..
		$('a').each(function (){
			//Scrape links that have text containing contact or team
			if (/(contact|team)/gi.test($(this).text())) reqHref($(this).attr('href').trim(),website);
		});
	});
});

process.on('exit', (code)=>{
	console.log(InfoObj)
});