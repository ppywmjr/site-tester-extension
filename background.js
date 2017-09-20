var isTestNotStartedRunningOrFinished = "notStarted"; //notStarted running or finished
//var linksArray = [];
var linksSet = new Set();
var arrayOfPagesWithError = [];
var numberOfPagesChecked = 0;
var maxNumberOfPagesToCheck;
var lookFor = ""; //= "error"
var linksMustContain = "";
var tempLinksArray = [];
//var tempLinksSet = new Set();
var arrayOfLinksOnPages = [];
var currentPageURL = "http://";
var errorsAndTheirLinksArray = [];
var sentNextPage;
var lastSentPage;

chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          console.log("greeting = " + request.greeting);
          console.log("isTestNotStartedRunningOrFinished is:" + isTestNotStartedRunningOrFinished);
        switch (request.greeting){
          case "What is currentPageURL":
                  sendResponse({startPageURL: currentPageURL});
                  break;
          case "Start":
                  var startURL = request.startURL;
                  sentNextPage = startURL;
                  lastSentPage = sentNextPage;
                  lookFor = request.lookFor;
                  linksMustContain = request.linksMustContain;
                  maxNumberOfPagesToCheck = request.maxNumberOfPagesToCheck;
                  //linksArray.push(startURL);
                  linksSet.add(startURL);
                  startTest(startURL);
                  break;
          case "Should I test?":
                  tempLinksArray = request.currentPageLinks;
                  if(shouldTestFinish()){
                    isTestNotStartedRunningOrFinished = "finished";
                    console.log("Changing state to finished");
                  }
                  switch (isTestNotStartedRunningOrFinished){
                    case "notStarted":
                      sendResponse({shouldITest: "No"});
                      currentPageURL = request.currentPageURL;
                      break;
                    case "finished":
                      sendResponse({shouldITest: "No"});
                      displayFinalResults();
                      resetExtension();
                      break;
                    case "running":
                      if (sentNextPage == request.currentPageURL){
                        //addUniqueURLsToLinksArray(tempLinksArray);
                        addUniqueURLsToLinksArray(tempLinksArray);
                        recordLinksOnCurrentPage(request.currentPageURL, tempLinksArray);
                        numberOfPagesChecked = numberOfPagesChecked + 1;
                        var linksArray = [...linksSet];
                        if (numberOfPagesChecked >= linksArray.length){
                          sentNextPage = "Stop";
                        }
                        else {
                          lastSentPage = sentNextPage;
                          sentNextPage = linksArray[numberOfPagesChecked];
                        }

                        console.log("Sent next page to check :" + sentNextPage);
                        sendResponse({shouldITest: "Yes", testFor: lookFor, nextPage: sentNextPage});

                      }
                      else {
                        console.log("not on the list");
                        sendResponse({shouldITest: "No"});
                      }
                    }
                      break;
          case "Sending error":
          //  var errorPageToStore = linksArray[numberOfPagesChecked-1];
            var errorPageToStore = lastSentPage;
            console.log("Adding to arrayOfPagesWithError:" + request.errorPage);
            arrayOfPagesWithError.push(errorPageToStore);
            console.log("arrayOfPagesWithError is now:");
            displayArrayInConsoleLog(arrayOfPagesWithError);
            sendResponse("Error Stored");
            if (isTestNotStartedRunningOrFinished == "finished" ){
              displayFinalResults();
              resetExtension();
            }

        }

});

chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("browser button clicked");
    chrome.tabs.create({'url': 'background.html'});
});

function startTest(startURL) {
    console.log("start button clicked");
    isTestNotStartedRunningOrFinished = "running";
    console.log("Sent next page to check :" + startURL);
    chrome.tabs.create({'url': startURL});
}


function shouldTestFinish(){
      console.log("shouldTestFinish called");
    if (isTestNotStartedRunningOrFinished == "notStarted"){
        console.log("return false");
        return false;
    } else if (numberOfPagesChecked >= maxNumberOfPagesToCheck){
      console.log("return true");
        return true;
    } else if (numberOfPagesChecked >= linksSet.size){
        addUniqueURLsToLinksArray(tempLinksArray);
        if (numberOfPagesChecked >= linksSet.size){
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
function addUniqueURLsToLinksArray(thisContentArray){
  let thisContentSet = new Set(thisContentArray);
  linksSet = linksSet.union(thisContentSet);
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
  linksArray = [...linksSet];
  displayArrayInConsoleLog(linksArray);
  console.log("error pages are:");
  displayArrayInConsoleLog(arrayOfPagesWithError);
  console.log("The number of pages tested is " + numberOfPagesChecked.toString())
  console.log("Number of pages with errors is " + arrayOfPagesWithError.length.toString());
  errorsAndTheirLinksArray = matchErrorPagesWithPagesThatLinkToThem(arrayOfPagesWithError, arrayOfLinksOnPages, arrayOfPagesWithError, errorsAndTheirLinksArray );
  var resultsHTML = convertErrorsAndTheirLinksArrayToHTML(errorsAndTheirLinksArray, numberOfPagesChecked);
  chrome.runtime.sendMessage({greeting: "display_results", HTMLtoDisplay: resultsHTML});
  notificationOfTestEnded();
  resetExtension();
}
function resetExtension(){
  isTestNotStartedRunningOrFinished = "notStarted"; //notStarted running or finished
  linksArray = [];
  linksSet.clear();
  arrayOfPagesWithError = [];
  numberOfPagesChecked = 0;
  maxNumberOfPagesToCheck = 0;
  lookFor = "";
  linksMustContain = "";
  tempLinksArray = [];
  tempLinksSet.clear();
  currentPageURL = "http://";
  arrayOfLinksOnPages = [];
  errorsAndTheirLinksArray = [];
  sentNextPage = "";
  lastSentPage = "";
}

function recordLinksOnCurrentPage(_thisPage, _thisLinksArray){
    arrayOfLinksOnPages.push([_thisPage, _thisLinksArray]);
}
function notificationOfTestEnded(){
    var opt = {
      type: "basic",
      title: "Link Skimmer",
      message: "Finished skimming your links",
      iconUrl: "SiteSkimmer32.png"
    };
    chrome.notifications.create(opt);

}

Set.prototype.union = function(setB) {
    var union = new Set(this);
    for (var elem of setB) {
        union.add(elem);
    }
    return union;
}
