var isTestRunning = false;
var linksArray = ["http://www.catherinetaylordance.co.uk", "http://www.catherinetaylordance.co.uk/about/", "http://www.catherinetaylordance.co.uk/contact/"];
var arrayOfPagesWithError = [];
var numberOfPagesChecked = 0;
var maxNumberOfPagesToCheck = 3;
var lookFor = "catherine";

chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
        console.log("Request to test page received from content.");
        console.log("greeting is" + request.greeting);
        console.log("error page is" + request.errorPage);
      //  AddUniqueURLsToLinksArray(request.currentPageLinks);
        if (request.greeting == "Should I test?"){
          if (isTestRunning == false){
              console.log("response: No");
              sendResponse({shouldITest: "No"});
          }else if (numberOfPagesChecked == maxNumberOfPagesToCheck){
            console.log("maxNumberOfPagesToCheck reached");
            isTestRunning = false;
            sendResponse({shouldITest: "No"});
            console.log("error pages are:");
            displayArrayInConsoleLog(arrayOfPagesWithError);
            console.log("The linksArray is:");
            displayArrayInConsoleLog(linksArray);
          }else {
              console.log("response: yes");
              sendResponse({shouldITest: "Yes", testFor: lookFor, nextPage: linksArray[numberOfPagesChecked]});
              numberOfPagesChecked = numberOfPagesChecked + 1;
              console.log(numberOfPagesChecked);
          }
        } else if (request.errorPage != null){
          console.log(request.errorPage);
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

function hrefIsTheSame(link1, link2) {
console.log("hrefIsTheSame called");
  if (link1 == link2) {
    return true;
  } else {
    return false;
  }
}

function ifLinkIsUniqueAppendItToArray(thisLink, thisLinksArray) {
console.log("ifLinkIsUniqueAppendItToArray called");
  var arrayLength = thisLinksArray.length;
  for (x = 0; x < arrayLength; x++) {
    if (hrefIsTheSame(thisLink, thisLinksArray[x])) {
      console.log("duplicate url " + thisLink);
      return;
    }
  }
  console.log( "unique url");
  linksArray.push(thisLink);
}

function AddUniqueURLsToLinksArray(contentArray){
  console.log("AddUniqueURLsToLinksArray called");

$("a").each(function() {
  console.log("looked up links");
  var _thisHref = this.href;
  console.log(_thisHref);
  ifLinkIsUniqueAppendItToArray(_thisHref, linksArray);
});
}

function displayArrayInConsoleLog( _thisArray ){
  //console.log("displayArrayInConsoleLog called");
  var thisArrayLength = _thisArray.length;
  for (x = 0; x < thisArrayLength; x++) {
    console.log( _thisArray[x] );
  }
}
