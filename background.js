var isTestRunning = false;
var linksArray = ["http://www.catherinetaylordance.co.uk"];
var arrayOfPagesWithError = [];
var numberOfPagesChecked = 0;
var maxNumberOfPagesToCheck = 3;
var lookFor = "catherine";
var linksMustContain = "catherinetaylordance.co.uk";

chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
        console.log("Request to test page received from content.");
        console.log("greeting is " + request.greeting);
        console.log("error page is " + request.errorPage);
        //displayArrayInConsoleLog(linksArray);
        if (request.greeting == "Should I test?"){
          if (isTestRunning == false){
              console.log("response: No");
              sendResponse({shouldITest: "No"});
          }else if (numberOfPagesChecked == maxNumberOfPagesToCheck){
            console.log("maxNumberOfPagesToCheck reached");
            isTestRunning = false;
            sendResponse({shouldITest: "No"});
            if (request.currentPageLinks != null) {
              //console.log("ContentpageLinks are: ");
              //displayArrayInConsoleLog(request.currentPageLinks);
              AddUniqueURLsToLinksArray(request.currentPageLinks);
            }
            console.log("error pages are:");
            displayArrayInConsoleLog(arrayOfPagesWithError);
            console.log("The linksArray is:");
            displayArrayInConsoleLog(linksArray);
          }else {
              console.log("response: yes");
              if (request.currentPageLinks != null) {
                //console.log("ContentpageLinks are: ");
                //displayArrayInConsoleLog(request.currentPageLinks);
                AddUniqueURLsToLinksArray(request.currentPageLinks);
              }
              sendResponse({shouldITest: "Yes", testFor: lookFor, nextPage: linksArray[numberOfPagesChecked]});
              numberOfPagesChecked = numberOfPagesChecked + 1;
              console.log("numberOfPagesChecked = " + numberOfPagesChecked);
          }
        } else if (request.errorPage != null){
          console.log("Adding to arrayOfPagesWithError:" + request.errorPage);
          arrayOfPagesWithError.push(request.errorPage);
        }
      });

chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("browser button clicked");
    isTestRunning = true;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {greeting: "StartTesting", testFor: lookFor, nextPage: linksArray[numberOfPagesChecked]}, function(response) {
      });
    });
});

function AddUniqueURLsToLinksArray(contentArray){
  console.log("AddUniqueURLsToLinksArray called");
  var arrayLength = contentArray.length;
  //console.log("Content page links array length is " + arrayLength.toString())
  for (x = 0; x < arrayLength; x++) {
  var _thisHref = contentArray[x];
  //console.log(_thisHref);
    if (_thisHref.includes(linksMustContain)){
      ifLinkIsUniqueAppendItToArray(_thisHref, linksArray);
    }
  }
}

function ifLinkIsUniqueAppendItToArray(thisLink, thisLinksArray) {
console.log("ifLinkIsUniqueAppendItToArray called");
  var arrayLength = thisLinksArray.length;
  for (y = 0; y < arrayLength; y++) {
    if (hrefIsTheSame(thisLink, thisLinksArray[y])) {
    //  console.log("duplicate url " + thisLink);
      return;
    }
  }
  //console.log( "unique url");
  linksArray.push(thisLink);
}

function hrefIsTheSame(link1, link2) {
console.log("hrefIsTheSame called");
  if (link1 == link2) {
    return true;
  } else {
    return false;
  }
}

function displayArrayInConsoleLog( _thisArray ){
  //console.log("displayArrayInConsoleLog called");
  var thisArrayLength = _thisArray.length;
  for (z = 0; z < thisArrayLength; z++) {
    console.log( _thisArray[z] );
  }
}
