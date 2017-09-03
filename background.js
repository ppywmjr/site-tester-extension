var isTestNotStartedRunningOrFinished = "notStarted"; //notStarted running or finished
var linksArray = [];
var arrayOfPagesWithError = [];
var numberOfPagesChecked = 0;
var maxNumberOfPagesToCheck = 10;
var lookFor = "error";
var linksMustContain = "testpage";
var tempLinksArray = [];

chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          console.log("greeting = " + request.greeting);
          console.log("isTestNotStartedRunningOrFinished is:" + isTestNotStartedRunningOrFinished);
        switch (request.greeting){
          case "Should I test?":
                  tempLinksArray = request.currentPageLinks;
                  if(shouldTestFinish()){
                    isTestNotStartedRunningOrFinished = "finished";
                    console.log("Changing state to finished");
                  }
                  switch (isTestNotStartedRunningOrFinished){
                    case "notStarted":
                      sendResponse({shouldITest: "No"});
                      break;
                    case "finished":
                      sendResponse({shouldITest: "No"});
                      displayFinalResults();
                      break;
                    case "running":
                    addUniqueURLsToLinksArray(tempLinksArray);
                    numberOfPagesChecked = numberOfPagesChecked + 1;
                    if (numberOfPagesChecked >= linksArray.length){
                    var sentNextPage = "Stop";
                    } else {
                      var sentNextPage = linksArray[numberOfPagesChecked];
                    }
                    console.log("Sent next page to check :" + sentNextPage);
                    sendResponse({shouldITest: "Yes", testFor: lookFor, nextPage: sentNextPage});
                  }

            break;
          case "Sending error":
            var errorPageToStore = linksArray[numberOfPagesChecked-1];
            console.log("Adding to arrayOfPagesWithError:" + request.errorPage);
            arrayOfPagesWithError.push(errorPageToStore);
            console.log("arrayOfPagesWithError is now:");
            displayArrayInConsoleLog(arrayOfPagesWithError);
            sendResponse("Error Stored");
            if (isTestNotStartedRunningOrFinished == "finished" ){
              displayFinalResults();
            }
          }

});

chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("browser button clicked");
    isTestNotStartedRunningOrFinished = "running";
    addUniqueURLsToLinksArray(tempLinksArray);
    numberOfPagesChecked = numberOfPagesChecked + 1;
    var nextPageToCheck = linksArray[numberOfPagesChecked];
    console.log("Sent next page to check :" + nextPageToCheck);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "StartTesting", testFor: lookFor, nextPage: nextPageToCheck}, function(response) {
      });
    });
});

function shouldTestFinish(){
      console.log("shouldTestFinish called");
    if (isTestNotStartedRunningOrFinished == "notStarted"){
        console.log("return false");
        return false;
    } else if (numberOfPagesChecked >= maxNumberOfPagesToCheck){
      console.log("return true");
        return true;
    } else if (numberOfPagesChecked >= linksArray.length){
        addUniqueURLsToLinksArray(tempLinksArray);
        if (numberOfPagesChecked >= linksArray.length){
          console.log("return true");
          return true;
        }
        console.log("return false");
        return false;
    } else {
      console.log("return false");
      return false;
    }
}

function addUniqueURLsToLinksArray(contentArray){
  console.log("addUniqueURLsToLinksArray called");
  var arrayLength = contentArray.length;
  //console.log("Content page links array length is " + arrayLength.toString())
  for (x = 0; x < arrayLength; x++) {
  var _thisHref = contentArray[x];
  //console.log(_thisHref);
    if (_thisHref.includes(linksMustContain)){
      ifLinkIsUniqueAppendItToArray(_thisHref, linksArray);
    }
  }
  console.log("linksArray is now:")
  displayArrayInConsoleLog(linksArray);
}

function ifLinkIsUniqueAppendItToArray(thisLink, thisLinksArray) {
  console.log("ifLinkIsUniqueAppendItToArray called");
  var arrayLength = thisLinksArray.length;
  for (y = 0; y < arrayLength; y++) {
    if (hrefIsTheSame(thisLink, thisLinksArray[y])) {
      return;
    }
  }
  linksArray.push(thisLink);
}

function hrefIsTheSame(link1, link2) {
  if (link1 == link2) {
    return true;
  } else {
    return false;
  }
}

function displayArrayInConsoleLog( _thisArray ){
  console.log("displayArrayInConsoleLog called");
  var thisArrayLength = _thisArray.length;
  for (z = 0; z < thisArrayLength; z++) {
    console.log( _thisArray[z] );
  }
}

function displayFinalResults(){
  console.log("displayFinalResults called");
  console.log("The linksArray is:");
  displayArrayInConsoleLog(linksArray);
  console.log("error pages are:");
  displayArrayInConsoleLog(arrayOfPagesWithError);
  console.log("The number of pages tested is " + numberOfPagesChecked.toString())
  console.log("Number of pages with errors is " + arrayOfPagesWithError.length.toString());
}

function resetExtension(){
  linksArray = [];
  arrayOfPagesWithError = [];
  numberOfPagesChecked = 0;
}
