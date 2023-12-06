/* DOIResolver.js
  Author: Austin Smith
  These functions are intended for use with the ILLiad ArticleRequest.html page.
*/

/* Modifications by Meredith Foster
 * - Fixed API for OpenAccessButton
 * - Display a loading spinner when the OpenAccess is running
 * - Bind ENTER in either box to the appropriate button rather than the default of submit form.
 * - Merged in Austin's PubMed support, modified to search PubMed rather than the PMC.
*/

/*If you want to use an API key for the OpenAccess button, edit line 188 */

// Element IDs
const DoiInputId = "DOI";
const DoiErrorMessageDivId = "doierrormessage";
const DoiErrorMessageText = "There was an error retrieving this DOI.";
const PmidInputId = "PMID";
const PmidErrorMessageDivId = "pmiderrormessage"
const PmidErrorMessageText = "There was an error retrieving this PubMed ID.";
const OpenAccessButtonDivId = "openaccessdiv";
const OpenAccessButtonId = "openaccessbutton";
const OpenAccessLoadingDivId = "oaloading";

//const PmidBaseUrl =  "https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?ids=";
const PmidBaseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id="

/* Attempt to retrieve the JSON metadata associated with a DOI.
   If successful, pass the JSON to a function which will populate the form.
   Otherwise, display an error message.
*/
function resolveDOI(doi = null, errorDiv = DoiErrorMessageDivId, errorMessage = DoiErrorMessageText){
  clearErrorMessage(errorDiv);
  hideOpenAccessLink();
  
  if (doi == null) {
      // Perform some basic cleanup on the DOI - 
      // use https, remove spaces, ensure the correct url is used, 
      // remove a trailing period if there is one.
      var doi = document.getElementById(DoiInputId).value.trim();
      doi = doi.replace("http:","https:").replace(" ","").replace("dx.doi.org","doi.org");
      if (doi.substr(-1) == "."){ doi = doi.substr(0, doi.length - 1); }
  }
  
  if (doi == "") {
        displayErrorMessage(errorDiv, "Please enter a DOI");
        return;
  }
  
  var doi_url = (doi.includes("https://doi.org/")) ? doi : "https://doi.org/" + doi;
  console.log(doi_url);

  // create an http request, specifying that a JSON response is desired.
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onloadend = function() {
    if (xmlhttp.status == 200) {
      autofillFields(this.responseText);
      checkOpenAccess(doi); // Working with the new API
    } else if (xmlhttp.status == 404) {
      displayErrorMessage(errorDiv, errorMessage);
    }
  };
  displayOpenAccessLoading();
  xmlhttp.open("GET", doi_url, true);
  xmlhttp.setRequestHeader("Accept", "application/vnd.citationstyles.csl+json")
  xmlhttp.send();
}

// Get a DOI from a PMID using the API described here: https://www.ncbi.nlm.nih.gov/pmc/tools/id-converter-api/
function resolvePMID(){
  clearErrorMessage(PmidErrorMessageDivId);
  var pmid = document.getElementById(PmidInputId).value;
  pmid = pmid.replace(" ","");
  pmid_url = PmidBaseUrl + pmid + "&format=json"

  console.log(pmid_url);
  
    // create an http request, specifying that a JSON response is desired.
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onloadend = function() {
      if (xmlhttp.status == 200) {
        let resp = JSON.parse(this.responseText);
        if (resp.result[pmid].articleids) {
            for (let index = 0; index < resp.result[pmid].articleids.length; ++index) {
                if (resp.result[pmid].articleids[index].idtype == "doi") {
                    let doi = resp.result[pmid].articleids[index].value
                    resolveDOI(doi, PmidErrorMessageDivId, PmidErrorMessageText);
                    autofillFields(this.responseText);
                    checkOpenAccess(doi_url);
                    return;
                }
            }
            // If I reach this, no DOI was found, write that as an error.
            displayErrorMessage(PmidErrorMessageDivId, "Unable to read the citation from PubMed");
            return;
        }
        else {
            displayErrorMessage(PmidErrorMessageDivId, PmidErrorMessageText);
            return;
        }
      } else if (xmlhttp.status == 404) {
        displayErrorMessage(PmidErrorMessageDivId, PmidErrorMessageText);
      }
    };
    xmlhttp.open("GET", pmid_url, true);
    xmlhttp.setRequestHeader("Accept", "application/vnd.citationstyles.csl+json")
    xmlhttp.send();
}

// Display an error message if no metadata could be retrieved.
function displayErrorMessage(divId, message){
  error_message = document.getElementById(divId)
  error_message.innerHTML = "<b>"+message+"</b><br>"
}

function clearErrorMessage(divId){
  error_message = document.getElementById(divId)
  error_message.innerHTML = ""
}


function autofillFields(responseText){
  citation_json = JSON.parse(responseText);

  var author_list = new Array();
  if (citation_json.author){
    citation_json.author.forEach( function(auth) {
      author_list.push(auth.given + " " + auth.family);
    })
  }
  authors = author_list.join(", ");
  
  if (citation_json.ISSN){
    isxn = citation_json.ISSN[0];
  } else if (citation_json.ISBN){
    isxn = citation_json.ISBN[0];
  } else {
    isxn = "";
  }
    
  
  doi_field = document.getElementById("DOI") || null;
  journal_title_field = document.getElementById("PhotoJournalTitle") || null;
  volume_field = document.getElementById("PhotoJournalVolume") || null;
  issue_field = document.getElementById("PhotoJournalIssue") || null;
  year_field = document.getElementById("PhotoJournalYear") || null;
  month_field = document.getElementById("PhotoJournalMonth") || null;
  pages_field = document.getElementById("PhotoJournalInclusivePages") || null;
  article_author_field = document.getElementById("PhotoArticleAuthor") || null;
  article_title_field = document.getElementById("PhotoArticleTitle") || null;
  isxn_field = document.getElementById("ISSN") || null;
  publisher_field = document.getElementById("PhotoItemPublisher") || null;
  
  if (doi_field) {doi_field.value = citation_json.DOI || null;}
  if (journal_title_field) {journal_title_field.value = citation_json["container-title"] || null;}
  if (volume_field) {volume_field .value = citation_json.volume || null;}
  if (issue_field) {issue_field .value = citation_json.issue || null;}
  if (year_field) {year_field .value = citation_json.issued["date-parts"][0][0] || null;}
  if (month_field) {month_field .value = citation_json.issued["date-parts"][0][1] || null;}
  if (pages_field) {pages_field .value = citation_json.page || null;}
  if (article_author_field) {article_author_field.value = authors || null;}
  if (article_title_field) {article_title_field.value = citation_json.title || null;}
  if (isxn_field) {isxn_field.value = isxn || null;}
  if (publisher_field) {publisher_field.value = citation_json.publisher || null;}
   
}

// Check openaccessbutton.org for an open access copy.
function checkOpenAccess(doi){
  oa_url = "https://api.openaccessbutton.org/find?id=" + encodeURIComponent(doi)
  //console.log(oa_url)
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onloadend = function() {
    hideOpenAccessLoading();
    if (xmlhttp.status == 200) {
      response = JSON.parse(this.responseText)
      if (response.url) {
          console.log(response);
          displayOpenAccessLink(response.url);
      } else {
          console.log("no open access");
      }
    } else if (xmlhttp.status == 404) {
      console.log("no open access");
    }
  };
  xmlhttp.open("GET", oa_url, true);
  // Note:  If you wish to use an API key, uncomment this line and put your API key in the field.
  //xmlhttp.setRequestHeader("x-apikey", "your-api-key-here");
	
  //xmlhttp.setRequestHeader("Accept", "application/vnd.citationstyles.csl+json")
  xmlhttp.send();
}

// If an OA link was found, display it.
function displayOpenAccessLink(url){
   oadiv = document.getElementById(OpenAccessButtonDivId);
   oadiv.setAttribute("style", "display:block");
   oabtn = document.getElementById(OpenAccessButtonId);
   oabtn.onclick = function(){ window.open(url,'_blank') }
}

function hideOpenAccessLink(){
   oadiv = document.getElementById(OpenAccessButtonDivId);
   oadiv.setAttribute("style", "display:none");
}

// Display or hide the loading screen
function displayOpenAccessLoading(){
   oadiv = document.getElementById(OpenAccessLoadingDivId);
   oadiv.setAttribute("style", "display:block");
}

function hideOpenAccessLoading(){
   oadiv = document.getElementById(OpenAccessLoadingDivId);
   oadiv.setAttribute("style", "display:none");
}

/* Finally, set the default action for pressing Enter in the DOI lookup field.
   We want it trigger the resolveDOI() function instead of cancel the form.
*/
var doiinputfield = document.getElementById(DoiInputId);
doiinputfield.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    resolveDOI();
  }
});

var pmidinputfield = document.getElementById(PmidInputId);
pmidinputfield.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    resolvePMID();
  }
});