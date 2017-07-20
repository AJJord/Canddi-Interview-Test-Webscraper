# Canddi-Interview-Test-Webscraper
Author: Alexander Jordan

version: 3

Web scraper that retrieves phone numbers, email addresses and postcodes from website pages

## Dependencies:
 - require
 - request
 - fs
 - readline
 - cheerio

## Planned additional features:
- Identify 'contact detail pages' to look for additional information
- look for 'team pages' for employee linkedin/social media profiles 

## Change log:
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
