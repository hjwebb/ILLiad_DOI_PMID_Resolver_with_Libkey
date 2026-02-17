# ILLiad_DOI_PMID_Resolver_with_Libkey
## Description / What this does
This code enables the article request form in ILLiad to have searchable DOI and PMID fields. Clicking a Lookup Button queries Crossref and PubMed to fill out the article request form. It also queries ThirdIron's API to display full-text links to subscription and open access content listed in your ThirdIron holdings (A ThirdIron subscription is required to use the API). The code also checks the ThirdIron API for retraction information upon page load for openurl entries and upon clicking the Lookup Button for manual citation information lookups. 

<!-- ![image](https://github.com/hjwebb/ILLiad_DOI_PMID_Resolver_with_Libkey/assets/20861245/2271d03c-4884-45b2-842e-49cce740ee1d) -->
![retracted_article_example](https://github.com/user-attachments/assets/75e2e676-85ed-4e51-a8ec-75217ef94820)


## History
DOI Resolver was originally developed by A.S. and demo-ed at some Atlas Systems sponsored sessions. M.F. made some edits, wrote some directions, and shared on one of the ILL listservs. These versions used OpenAccess button in addition to Crossref and PubMed APIs. M.C and H.W., adjusted it further to query ThirdIron’s Libkey rather than OpenAccess button. B.S. contributed some additional code to improve the user experience.

## Directions
The associated powerpoint file generally describes what the functionality is and what files need to be edited. It is a little outdated and does not include retraction information. Some basic instructions are below.

## Javascript File
In DOIPMIDResolver_LK.js **add your ThirdIron ID and an API key by editing lines 37 and 38**
Put .js file on your webpage server in the folder called “js”

Another older js file is still included for reference: DOIResolver.js It uses OA.Works’ OpenAccess button which has been sunsetted since posting.

### Website Tracking - Matomo and JS File
If you use Matomo and want to capture the Libkey link as an outlink in Matomo, hide the function in lines 368-373 and unhide the function in lines 377 to 385. You'll probably want to change the link description 'https://libkey.io/libraries/1990/ illresolver' to match your needs.

## Article Request html page
Note: This page is edited from the 9.2.0 default pages. 

1. Add the code to call the javascript file in the head section
```
	<script type="text/javascript" src="js/DOIPMIDResolver_LK_test.js" defer></script>
```
2. Edit DOI and PMID fields.
```
                            <label for="DOI">
                                <span class="field">
                                    <span class="<#ERROR name='ERRORDOI'>">
                                        DOI
                                    <div class="tooltip">
									<span aria-hidden="true" class="fas fa-info-circle mr-1"></span><span class="tooltiptext">This DOI resolver will take a Digital Object Identifier and complete the citation information on this article request form. If you have already imported the citation from a database or Primo search, there is no need to look up the citation with the identifiers. </span>								
								</div>
									
									</span>
									
                                </span>
                            </label>
                            <input type="text" class="form-control" name="DOI" id="DOI" value="<#PARAM name='DOI'>">  
							<button type="button" id="doibutton" class="btn btn-primary btn-md c-doi" onclick="resolveDOI()">Look Up Citation Information by DOI 

							</button> 
								
							<br>
                            <span class="note text-danger" id="doierrormessage"></span>
                        </div>
						
                        <div class="form-group col-md-9">
                            <label for="PMID">
                                <span class="field">
                                    <span class="<#ERROR name='ERRORPMID'>">
                                        PubMed ID
									<div class="tooltip">
									<span aria-hidden="true" class="fas fa-info-circle mr-1"></span><span class="tooltiptext">This PMID resolver will take a PubMed unique identifier number and complete the citation information on this article request form. If you have already imported the citation from a database or Primo search, there is no need to look up the citation with the identifiers. </span>								
								</div>
										
                                    </span>
                                </span>
                            </label>
                            <input type="text" class="form-control" name="PMID" id="PMID" value="<#PARAM name='PMID'>">
                            <button type="button" id="pmidbutton" class="btn btn-primary btn-md c-doi" onclick="resolvePMID()">Look Up Citation Information by PMID</button><br>
                            <span class="note text-danger" id="pmiderrormessage"></span>
                        </div>
```
3. Add LibKey full text link sections
```
	<div aria-live="polite">
                            <div id="oaloading" style="display:none">
                                <div class="spinner-border text-warning" role="status"><span class="sr-only">oaloading Looking up full text access...</span></div>
                                <span class="note">Looking up full text access...</span>
                            </div>
                            <div id="openaccessdiv" style="display:none">
                                <span class="note">*The article is available through a library subscription or open access. If the link is NOT correct, please continue to submit your request.</span><br/>
                                <button type="button" class="btn btn-primary btn-md c-open" id="openaccessbutton">View/Download Full Text <span aria-hidden="true" class="fas fa-file-alt"></span></button><br/>
								<button class="btn btn-secondary btn-md" type="reset" id="buttonReset" name="ResetButton" value="Clear Form">Reset form</button>
                            </div>
							<div id="success" style="display:none;">
								 <!-- 
								 include this paragraph if you want a message to appear after a successful lookup 
								 <p class="none">The article request form has been filled with the information about this article.</p> 
								 -->
							<button class="btn btn-secondary btn-md" type="reset" id="buttonReset2" name="ResetButton" value="Clear Form">Reset Form</button> <!-- button needs the buttonReset2 id to clear correctly with the js code -->
							</div>
                        </div>
```

4. Add Retraction sections if interested in that notice.
```
<div name="retraction" class="retraction" id="retraction" style="display:none;">
	<p>Retracted Article <a href="">View information about the retraction.</a></p>
</div>
						
<div name="retractcitations" class="retractcitations" id="retractcitations" style="display:none;">
	<p>Note: This article contains retracted citations.</p>
</div>
```

## CSS File
This file only needs to be updated to match your local look and feel or adjust to match the examples in the powerpoint and images in this repository. In particular, the 'attached' articlerequest.html file includes a tooltip not found in the default webpages.
Specifically, lines 215-256 adjust various tooltips and 145-192 adjust formating for the DOI, PMID, success, and retraction sections. 



