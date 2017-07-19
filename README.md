# Canddi-Interview-Test-Webscraper
Author: Alexander Jordan

version: 2

Web scraper that retrieves phone numbers, email addresses and postcodes from website pages

## Dependencies:
 - require
 - request
 - fs

## Planned additional features:
- Full address scraping (rather than just postcode)
- Identify 'contact detail pages' to look for additional information
- look for 'team pages' for employee linkedin/social media profiles 

## Change log:
### v2
- Added scraping for social media links.
- Moved regex definitions to a seperate json file. File is imported and converted to and stored as a js object.
- The object used to store information found is generated from the regex storage object.
- Website is now extracted from an email address.
- Data scraping implmented generically with a for loop and placed in a function for use in planned features. 
