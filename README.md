# ILLiad_DOI_PMID_Resolver_with_Libkey
## Description / What this does
Ability to enter a DOI or PMID to query Crossref and PubMed to fill out the article request form AND query your ThirdIron holdings for subscription or open access content.

![image](https://github.com/hjwebb/ILLiad_DOI_PMID_Resolver_with_Libkey/assets/20861245/2271d03c-4884-45b2-842e-49cce740ee1d)


## History
DOI Resolver was originally developed by A.S. and demo-ed at some Atlas Systems sponsored sessions. M.F. made some edits, wrote some directions, and shared on one of the ILL listservs. These versions used OpenAccess button in addition to Crossref and PubMed APIs. M.C and H.W., adjusted it further to query ThirdIron’s Libkey rather than OpenAccess button.

## Directions
The associated powerpoint file walks through what the functionality is and what files need to be edited. Some basic instructions are below.

## Javascript File
Two file versions exist depending on whether you have a subscription to ThirdIron and want to use that service to deliver full text articles within the article request page. 
- DOIPMIDResolver_LK.js uses ThirdIron’s Libkey
  - Add your ThirdIron ID and an API key by editing lines 30 and 31
- DOIResolver.js uses OA.Works’ OpenAccess button
  - Edit Line 188 if you want to use an API key

Put .js file on webpage server in the folder called “js”

## Article Request html page
1. Add the code to call the javascript file in the head section
2. Edit DOI and PMID fields
3. Add LibKey or OpenAccess button link sections

## CSS File
This file only needs to be updated to match your local look and feel or adjust to match the examples in the powerpoint and images in this repository. In particular, the 'attached' articlerequest.html file includes a tooltip not found in the default webpages.




