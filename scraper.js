//Requirements
var request = require('request');

//Object to store data taken from the website
var InfoObj = {
	telephone:[],
	email:[],
	postcode:[],
};

//function to scrape data from element text using a regular expression (regex) and store the data into a storage array
function scrapeRegex(elementText, storageArray, regex){
	//store array of regex matches
	var matchlist = elementText.match(regex);
	//iterate over array
	for ( var i in matchlist){
		//If match isn't already included, add to array
		if (!storageArray.includes(matchlist[i])) storageArray.push(matchlist[i]);
	}
};


request({
	method: 'GET',
	url: 'http://canddi.com/'
},function(err, response, body) {
	if(err) return console.error(err);

	//Scrape...
	//Phone numbers
	scrapeRegex(body,InfoObj.telephone,/(\+\d{1,3}\s?(\s\(0\))?|0)(\d{3}\s?\d{3}\s?\d{4}|\d{4}\s?\d{6})(?![0-9])/g);
	//Email addresses
	scrapeRegex(body, InfoObj.email, /[A-Za-z][A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z]{3}|(\.[A-Za-z]{2}){2})/g);
	//Post codes
	scrapeRegex(body,InfoObj.postcode, /[A-Z]{1,2}(([0-9]{1,2})|([0-9][A-Z]))\s[0-9][A-Z]{1,2}/g);

	//Print object to console
	console.log(InfoObj);
});
