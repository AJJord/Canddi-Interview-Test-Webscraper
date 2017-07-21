/*~~~Requirements~~~*/
const request = require('request');
const fs = require('fs');
const readline = require('readline');
const cheerio = require('cheerio');

/*~~~Global Variables~~~*/
//Get regexs used for searching webpage from the json file
var regexpress = JSON.parse(fs.readFileSync('scraperRegexs.json'));
const urlRegExp = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
//Object to store data taken from the website
var InfoObj = {};
//Generate object using regexpress object
for (let key in regexpress){
	InfoObj[key] =[];
}
//Array to store data from about page
var aboutInfo = [];

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
Arguments: Text to collect data from | object of arrays to store to
*/
function genericDataSearch(body,storageObj){
	//Scrape info for each key in infoObj
	//Perform a pass with plain html
	for (let key in storageObj) scrapeRegex(body,storageObj[key],new RegExp(regexpress[key][0],regexpress[key][1]));
	//perform a pass with visible text extracted by cheerio
	let $c = cheerio.load(body);
	$c('body').each(function(){
		let tagText = $c(this).text();
		for (let key in storageObj) scrapeRegex(tagText,storageObj[key],new RegExp(regexpress[key][0],regexpress[key][1]));
	});
}

/*
Summary:   Function for scraping paragraphs from pages (about us pages etc.)
Arguments: The text to scrape | Array to store paragraphs
*/
function paragraphScrape(body,storageArray){
	let $p = cheerio.load(body);
	$p('p').each(function(){
		let paraText = $p(this).text();
		if(!storageArray.includes(paraText)) storageArray.push(paraText);
	});
}

/*
Summary:   Takes a link scraped from a href attribute, formats it and makes a request to find more information.
Arguments: The scraped href value | the root URL of the site incase a relatve link is given | Function to use when scraping | where to store scraped info
*/
function reqHref(hrefVal, rootURL,scrapeFunc,storage){
	//Test if a relative link is given (eg. /contact/)
	if (!urlRegExp.test(hrefVal)){
		if (!hrefVal.startsWith('/')) hrefVal = '/'+hrefVal;
		hrefVal = rootURL + hrefVal;
	}
	//get page
	request(hrefVal, function(hreferr, hrefresponse, hrefbody){
		if(hreferr) return console.error(hreferr);
		console.log(hrefVal,' Accessed.');
		scrapeFunc(hrefbody,storage);
	});
}

/*
Summary:   Prints array elements to console one per line.
Arguments: Array to be printed | string to prefix array
*/
function arrayPrint(arrayobj){
	for(let elmnt in arrayobj){
		console.log(arrayobj[elmnt]);
	}
}

/*
Summary:   Prints a InfoObject in a more visually appealing way.
*/
function InfoObjPrint(infobj){
	console.log("\nInformation found{")
	for (let key in infobj){
		if (InfoObj[key].length) {
			console.log(key,":")
			arrayPrint(infobj[key]);
			console.log("")
		}
	}
	console.log("}")
}

/*~~~Page request and scraping~~~*/
//Set up readline
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
//Set default email value
var email = "example@canddi.com";
//Get email address
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

	//Extract web address from email and format it
	const website = 'http://www.' + email.split('@')[1];

		request(website,function (err, response, body){
			/*if(err) return */console.log("Status:",response.statusCode);

			//Scrape homepage
			genericDataSearch(body);

			const $ = cheerio.load(body);
			//Search links for additional pages to access
			$('a').each(function (){
				//Scrape links that have text containing contact or team
				if (/(contact|team)/i.test($(this).text())) reqHref($(this).attr('href').trim(),website,genericDataSearch,InfoObj);
				//Scrape about pages
				if(/(about)/i.test($(this).text())) reqHref($(this).attr('href').trim(),website,paragraphScrape,aboutInfo);
			});
		});
});

//Print data found on exit
process.on('exit', (code)=>{
	InfoObj['about'] = aboutInfo;
	InfoObjPrint(InfoObj);
});