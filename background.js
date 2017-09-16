var isTestNotStartedRunningOrFinished = "notStarted"; //notStarted running or finished
var linksArray = [];
var arrayOfPagesWithError = [];
var numberOfPagesChecked = 0;
var maxNumberOfPagesToCheck;
var lookFor = ""; //= "error"
var linksMustContain = "";
var tempLinksArray = [];
var arrayOfLinksOnPages = [];
var currentPageURL = "http://";
var errorsAndTheirLinksArray = [];

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
                  lookFor = request.lookFor;
                  linksMustContain = request.linksMustContain;
                  maxNumberOfPagesToCheck = request.maxNumberOfPagesToCheck;
                  linksArray.push(startURL);
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
                    addUniqueURLsToLinksArray(tempLinksArray);
                    recordLinksOnCurrentPage(request.currentPageURL, tempLinksArray);
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
  matchErrorPagesWithPagesThatLinkToThem(arrayOfPagesWithError, arrayOfLinksOnPages);
  var resultsHTML = convertErrorsAndTheirLinksArrayToHTML();
//  var resultsHTML = convertArrayToHTML(arrayOfPagesWithError);
  chrome.runtime.sendMessage({greeting: "display_results", HTMLtoDisplay: resultsHTML});
  resetExtension();
}

function convertArrayToHTML(_thisArray){
    var printThis;
    var numberOfErrorsFound = _thisArray.length;
    if (numberOfErrorsFound == 0){
      printThis = "<h1>No matches found</h1>";
      printThis += "<br>" + numberOfPagesChecked.toString() + " pages skimmed."

    } else {
      printThis = "<h1>Results found:</h1>";
      for(var i = 0; i < _thisArray.length; i++){
        printThis += "<a href='" + _thisArray[i] + "' target='_blank'>" + _thisArray[i] + "</a><br>";
      }
    }
    return printThis;
}

function resetExtension(){
  isTestNotStartedRunningOrFinished = "notStarted"; //notStarted running or finished
  linksArray = [];
  arrayOfPagesWithError = [];
  numberOfPagesChecked = 0;
  maxNumberOfPagesToCheck = 0;
  lookFor = "";
  linksMustContain = "";
  tempLinksArray = [];
  currentPageURL = "http://";
  closeTestTab();
}

function closeTestTab(){
  //chrome.tabs.getSelected(function(tab){
  //    chrome.tabs.remove(tab.id, function(){});
  //  });
}

function recordLinksOnCurrentPage(_thisPage, _thisLinksArray){
    arrayOfLinksOnPages.push([_thisPage, _thisLinksArray]);
}

function doesThisPageLinkToThisURL(_thisURL, _thisPagesLinksArray){
  var numberOfLinks = _thisPagesLinksArray.length;
  for(var i = 0; i < numberOfLinks; i++){
    if (_thisPagesLinksArray[i] == _thisURL){
      return true;
    }
  }
  return false;
}

function whichPagesHaveThisLink(_thisURL, _thisArrayOfLinksOnPages){
  var numberOfPages = _thisArrayOfLinksOnPages.length;
  var pagesThatHaveTheLink = [];
  for(var i = 0; i < numberOfPages; i++){
    var arrayOfPageAndItsLinks = _thisArrayOfLinksOnPages[i];
    if (doesThisPageLinkToThisURL(_thisURL, arrayOfPageAndItsLinks[1])){
      pagesThatHaveTheLink.push(arrayOfPageAndItsLinks[0]);
    }
  }
  return pagesThatHaveTheLink;
}

function matchErrorPagesWithPagesThatLinkToThem(_errorURLsArray , _thisArrayOfLinksOnPages){
  var numberOfErrorsFound = arrayOfPagesWithError.length;
  for (var i = 0; i < numberOfErrorsFound; i++){
    var thisErrorURL = _errorURLsArray[i];
    var isOnThesePages = whichPagesHaveThisLink(thisErrorURL, _thisArrayOfLinksOnPages);
    errorsAndTheirLinksArray.push([thisErrorURL, isOnThesePages]);
  }
}

function convertErrorsAndTheirLinksArrayToHTML(){
  var printThis;
  var numberOfErrorsFound = errorsAndTheirLinksArray.length;
  if (numberOfErrorsFound == 0){
    printThis = "<h1>No matches found</h1>";
    printThis += "<br>" + numberOfPagesChecked.toString() + " pages skimmed."
  } else {
    printThis = "<h1>Results found:</h1><ul>";
    for(var i = 0; i < numberOfErrorsFound; i++){
      var thisErrorURLAndLinks = errorsAndTheirLinksArray[i];
      var thisErrorURL = thisErrorURLAndLinks[0];
      var itsLinks = thisErrorURLAndLinks[1];
      var numberOfLinks = itsLinks.length;
      printThis += "<li>Error link is: ";
      printThis += "<a href='" + thisErrorURL + "' target='_blank'>" + thisErrorURL + "</a>";
      printThis += "<br>Pages that link to it are:<br><p class='errorPageLinksP'>";
      for (var j = 0; j < numberOfLinks; j++ ){
        printThis += "<a href='" + itsLinks[j] + "' target='_blank'>" + itsLinks[j] + "</a><br>";
      }
      printThis += "</p></li>";
    }
  }
  printThis += "</ul>";
  return printThis;
}
