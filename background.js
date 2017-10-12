let isTestNotStartedRunningOrFinished = "notStarted"; //notStarted running or finished
let linksSet = new Set();
let arrayOfPagesWithError = [];
let numberOfPagesChecked = 0;
let maxNumberOfPagesToCheck = 10;
let lookFor = ""; //= "error"
let linksMustContain = "";
let linksMustNotContain = "";
let tempLinksArray = [];
let arrayOfLinksOnPages = [];
let currentPageURL = "";
let currentPageDomain = "";
let errorsAndTheirLinksArray = [];
let sentNextPage = "";
let lastSentPage = "";
let testTabID = "";
let autoContinue = "";
let isTestContinueBeingForced = false;

function resetExtension(){
  isTestNotStartedRunningOrFinished = "notStarted"; //notStarted running or finished
  linksSet.clear();
try {
  chrome.tabs.remove([testTabID], function() { });
}
catch(err) {
}
  arrayOfPagesWithError = [];
  numberOfPagesChecked = 0;
  maxNumberOfPagesToCheck = 0;
  lookFor = "";
  linksMustContain = "";
  tempLinksArray = [];
  arrayOfLinksOnPages = [];
  currentPageURL = "http://";
  currentPageDomain = "";
  errorsAndTheirLinksArray = [];
  sentNextPage = "";
  lastSentPage = "";
  testTabID = null;
  clearTimeout(autoContinue);
}


chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
        switch (request.greeting){
          case "What is currentPageURL":
                  sendResponse({startPageURL: currentPageURL, startPageDomain: currentPageDomain});
                  break;
          case "Start":
                  let startURL = request.startURL;
                  sentNextPage = startURL;
                  lastSentPage = sentNextPage;
                  lookFor = request.lookFor;
                  linksMustContain = request.linksMustContain;
                  linksMustNotContain = request.linksMustNotContain;
                  maxNumberOfPagesToCheck = request.maxNumberOfPagesToCheck;
                  linksSet.add(startURL);
                  startTest(startURL);
                  break;
          case "Stop":
                  isTestNotStartedRunningOrFinished = "finished";
                  displayFinalResults();
                  resetExtension();
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
                      currentPageDomain = request.currentPageDomain;
                      break;
                    case "finished":
                      sendResponse({shouldITest: "No"});
                      displayFinalResults();
                      resetExtension();
                      break;
                    case "running":
                      if (numberOfPagesChecked === 0) {
                        testTabID = sender.tab.id;
                      }
                      if (isTestContinueBeingForced){
                        testTabID = sender.tab.id;
                        isTestContinueBeingForced = false;
                      }
                      if (testTabID === sender.tab.id){
                        tempLinksArray = removeLinksThatDontMeetRequirement(tempLinksArray, linksMustContain, linksMustNotContain);
                        addUniqueURLsToLinksArray(tempLinksArray);
                        recordLinksOnCurrentPage(request.currentPageURL, tempLinksArray);
                        numberOfPagesChecked = numberOfPagesChecked + 1;
                        let linksArray = [...linksSet];
                        if (numberOfPagesChecked >= linksArray.length){
                          sentNextPage = "Stop";
                        }
                        else {
                          lastSentPage = sentNextPage;
                          sentNextPage = linksArray[numberOfPagesChecked];
                        }
                        sendResponse({shouldITest: "Yes", testFor: lookFor, nextPage: sentNextPage});
                        clearTimeout(autoContinue);
                        autoContinue = setTimeout(autoContinueTest, 3000);
                      }
                      else {
                        sendResponse({shouldITest: "No"});
                      }
                    }
                      break;
          case "Sending error":
            arrayOfPagesWithError.push(request.errorPage);
            if (isTestNotStartedRunningOrFinished === "finished" ){
              displayFinalResults();
              resetExtension();
            }

        }

});

function autoContinueTest(){
  let linksArray = [...linksSet];
  let continueURL = linksArray[numberOfPagesChecked];
  numberOfPagesChecked += 1;
  if (continueURL !== null){
    isTestContinueBeingForced = true;
    try {    chrome.tabs.remove([testTabID], function() { });
  } catch(err) {}
    chrome.tabs.create({'url': continueURL});
  } else {
    displayFinalResults();
    resetExtension();
  }
}


chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({'url': 'background.html'});
});

function startTest(startURL) {
    isTestNotStartedRunningOrFinished = "running";
    chrome.tabs.create({'url': startURL});
}


function shouldTestFinish(){
    if (isTestNotStartedRunningOrFinished === "notStarted"){
        return false;
    } else if (numberOfPagesChecked >= maxNumberOfPagesToCheck){
        return true;
    } else if (numberOfPagesChecked >= linksSet.size){
        addUniqueURLsToLinksArray(tempLinksArray);
        return numberOfPagesChecked >= linksSet.size;
    }
      return false;
}

function removeLinksThatDontMeetRequirement(_contentArray, _linksMustContain, _linksMustNotContain){
    let reducedLinksArray = _contentArray.filter(function(elem){
        if (_linksMustNotContain === ""){
            if (elem.includes(_linksMustContain) === true && !isURLADocument(elem)) {
                return elem;
            }
        } else {
            if (elem.includes(_linksMustContain) === true && elem.includes(_linksMustNotContain) === false && !isURLADocument(elem)) {
                return elem;
            }
        }
    });
      return reducedLinksArray;
}

function addUniqueURLsToLinksArray(thisContentArray){
  let thisContentSet = new Set(thisContentArray);
  linksSet = linksSet.union(thisContentSet);
}

function displayFinalResults(){
  errorsAndTheirLinksArray = matchErrorPagesWithPagesThatLinkToThem(arrayOfPagesWithError, arrayOfLinksOnPages, arrayOfPagesWithError, errorsAndTheirLinksArray );
  let resultsHTML = convertErrorsAndTheirLinksArrayToHTML(errorsAndTheirLinksArray, numberOfPagesChecked, linksSet);
  chrome.runtime.sendMessage({greeting: "display_results", HTMLtoDisplay: resultsHTML});
  resetExtension();
  notificationOfTestEnded();
}


function recordLinksOnCurrentPage(_thisPage, _thisLinksArray){
    arrayOfLinksOnPages.push([_thisPage, _thisLinksArray]);
}
function notificationOfTestEnded(){
    let opt = {
      type: "basic",
      title: "Link Skimmer",
      message: "Finished skimming your links",
      iconUrl: "SiteSkimmer32.png"
    };
    chrome.notifications.create(opt);
}

Set.prototype.union = function(setB) {
    let union = new Set(this);
    for (let elem of setB) {
        union.add(elem);
    }
    return union;
};

function isURLADocument (url){
    let filetypes = ['.pdf', '.zip', '.exe', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.mp3', '.jpg', '.png', '.ico', '.avi', '.asf', '.mov', '.qt', '.avchd', '.flv', '.swf', '.mpg', '.mpeg', '.mp4', 'mpeg4', '.wmv','.divx','.tif', '.gif','.bat','.bin','.cmd','.ipa','.msc','.msi','.reg','docm','.jar'];
    for (let j = 0; j<filetypes.length; j++){
        if (url.toLowerCase().endsWith(filetypes[j])){return true;}
    }
    return false
}