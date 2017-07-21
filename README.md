# Canddi-Interview-Test-Webscraper
Author: Alexander Jordan

version: 5

Web scraper that retrieves phone numbers, email addresses and postcodes from website pages

## Dependencies:
 - require
 - request
 - fs
 - readline
 - cheerio

## Change log:
### v5
- Made information output more visually appealing.
- Added scraping for a website's about page to get a company description.
- Added paragraph tag scraping.
- Fixed bug where urls were being incorrectly validated
- Reworked reqHref function and scraping functions

### v4
- Improved twitter profile link scraping using twitter username limitations.
- Moved 'plain text' scraping stage into genericDataSearch function.
- Added functionality that searches for 'contact us' and 'meet the team' pages and scrapes data from them.

### v3
- Dependencies added: readline, cheerio.
- Added full address scraping, not perfect but can handle simple cases.
- Added command line interface for users to input email addresses.
- Program now scrapes data from text retrieved using cheerio aswell as from the raw html. This helps eliminate issues with scraping caused by tags such as 'span' and 'br'.
- program prints contents of InfoObj on exit to ensure all data has been scraped.

### v2
- Dependencies added: fs.
- Added scraping for social media links.
- Moved regex definitions to a seperate json file. File is imported and converted to and stored as a js object.
- The object used to store information found is generated from the regex storage object.
- Website is now extracted from an email address.
- Data scraping implmented generically with a for loop and placed in a function for use in planned features. 
