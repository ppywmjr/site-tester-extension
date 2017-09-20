var isTestNotStartedRunningOrFinished = "notStarted"; //notStarted running or finished
var linksSet = new Set();
var arrayOfPagesWithError = [];
var numberOfPagesChecked = 0;
var maxNumberOfPagesToCheck;
var lookFor = ""; //= "error"
var linksMustContain = "";
var tempLinksArray = [];
var arrayOfLinksOnPages = [];
var currentPageURL = "http://";
var errorsAndTheirLinksArray = [];
var sentNextPage;
var lastSentPage;

function resetExtension(){
  isTestNotStartedRunningOrFinished = "notStarted"; //notStarted running or finished
  linksSet.clear();
  arrayOfPagesWithError = [];
  numberOfPagesChecked = 0;
  maxNumberOfPagesToCheck = 0;
  lookFor = "";
  linksMustContain = "";
  tempLinksArray = [];
//  tempLinksSet.clear();
  arrayOfLinksOnPages = [];
  currentPageURL = "http://";
  errorsAndTheirLinksArray = [];
  sentNextPage = "";
  lastSentPage = "";
  request = null;
  response =null;
}


chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
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
                  linksSet.add(startURL);
                  startTest(startURL);
                  break;
          case "Stop":
                  isTestNotStartedRunningOrFinished = "finished";
                  break;
          case "Should I test?":
                  tempLinksArray = request.currentPageLinks;
                  if(shouldTestFinish()){
                    isTestNotStartedRunningOrFinished = "finished";
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
                        tempLinksArray = removeLinksThatDontMeetRequirement(tempLinksArray, linksMustContain)
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
                        sendResponse({shouldITest: "Yes", testFor: lookFor, nextPage: sentNextPage});

                      }
                      else {
                        sendResponse({shouldITest: "No"});
                      }
                    }
                      break;
          case "Sending error":
            var errorPageToStore = lastSentPage;
            arrayOfPagesWithError.push(errorPageToStore);
            //sendResponse("Error Stored");
            if (isTestNotStartedRunningOrFinished == "finished" ){
              displayFinalResults();
              resetExtension();
            }

        }

});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': 'background.html'});
});

function startTest(startURL) {
    isTestNotStartedRunningOrFinished = "running";
    chrome.tabs.create({'url': startURL});
}


function shouldTestFinish(){
    if (isTestNotStartedRunningOrFinished == "notStarted"){
        return false;
    } else if (numberOfPagesChecked >= maxNumberOfPagesToCheck){
        return true;
    } else if (numberOfPagesChecked >= linksSet.size){
        addUniqueURLsToLinksArray(tempLinksArray);
        if (numberOfPagesChecked >= linksSet.size){
          return true;
        }
        return false;
    } else {
      return false;
}
}

function removeLinksThatDontMeetRequirement(_contentArray, _linksMustContain){
    let reducedLinksArray = _contentArray.filter(function(elem){
    	if (elem.includes(_linksMustContain) == true){
      	return elem;
    	}
    });
      return reducedLinksArray;
}

function addUniqueURLsToLinksArray(thisContentArray){
  let thisContentSet = new Set(thisContentArray);
  linksSet = linksSet.union(thisContentSet);
}

function displayFinalResults(){
  //linksArray = [...linksSet];
  errorsAndTheirLinksArray = matchErrorPagesWithPagesThatLinkToThem(arrayOfPagesWithError, arrayOfLinksOnPages, arrayOfPagesWithError, errorsAndTheirLinksArray );
  var resultsHTML = convertErrorsAndTheirLinksArrayToHTML(errorsAndTheirLinksArray, numberOfPagesChecked);
  chrome.runtime.sendMessage({greeting: "display_results", HTMLtoDisplay: resultsHTML});
  resetExtension();
  notificationOfTestEnded();
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
