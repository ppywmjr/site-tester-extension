var contentPageLinksArray = [];

$( document ).ready(function() {
    console.log( "Document ready!" );
    addAllLinksToContentPageLinksArray();
    console.log("sending message to background");
    chrome.runtime.sendMessage({greeting: "Should I test?", currentPageLinks: contentPageLinksArray}, function(response) {
      console.log("shouldITest response is: " + response.shouldITest);
      console.log("test for: " + response.testFor);
      console.log("next page is: " + response.nextPage);
      if (response.shouldITest == "No"){
        setUpListener();
        return null;
      }
      else{
        testPage(response.testFor);
        if (response.nextPage == "Stop"){
          return null;
        }else{
        location.assign(response.nextPage);
        //location.reload();
        }
      }
    });
});


 function setUpListener(){
        console.log("setUpListener called");
        chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
        console.log("extension called from background");
        console.log(request.greeting);
        console.log(request.testFor);
        console.log(request.nextPage);
        testPage(request.testFor);
        if (request.nextPage == "Stop"){
          return null;
        }else{
        location.assign(request.nextPage);
        location.reload();
        }
      });
}

function addAllLinksToContentPageLinksArray(){
  console.log("addAllLinksToContentPageLinksArray called");
  var currentPageURL = window.location.href;
  contentPageLinksArray = [currentPageURL];
  $("a").each(function() {
    var _thisHref = this.href;
    contentPageLinksArray.push(_thisHref);
  });
//  displayArrayInConsoleLog(contentPageLinksArray);
}
/*
function addURLsToContentPageLinksArray(){
  console.log("AddURLsToLinksArray called");
$("a").each(function() {
  //console.log("looked up next link");
  var _thisHref = this.href;
  contentPageLinksArray.push(_thisHref);
  //console.log(_thisHref);
  //ifLinkIsUniqueAppendItToArray(_thisHref, contentPageLinksArray);
});
}
*/
function displayArrayInConsoleLog( _thisArray ){
  //console.log("displayArrayInConsoleLog called");
  var thisArrayLength = _thisArray.length;
  for (x = 0; x < thisArrayLength; x++) {
    console.log( _thisArray[x] );
  }
}

function testPage(error){
  console.log("testPage called")
  var isError = $( "*:contains('" + error + "')" ).length;
  console.log(isError.toString());
  if (isError > 0){
      console.log("error found")
      reportErrorToBackground();
  }else {
      console.log("error NOT found")
  }
return true;
}

function reportErrorToBackground(){
  var currentPageURL = window.location.href;
  console.log("window.location.href is: " + currentPageURL);
    chrome.runtime.sendMessage({errorPage: currentPageURL, greeting: "sending error"}, function(response) {});
}

/*
function ifLinkIsUniqueAppendItToArray(thisLink, thisLinksArray) {
console.log("ifLinkIsUniqueAppendItToArray called");
  var arrayLength = thisLinksArray.length;
  for (y = 0; y < arrayLength; y++) {
    if (hrefIsTheSame(thisLink, thisLinksArray[y])) {
      console.log("duplicate url " + thisLink);
      return;
    }
  }
  console.log( "unique url");
  contentPageLinksArray.push(thisLink);
}

function hrefIsTheSame(link1, link2) {
console.log("hrefIsTheSame called");
  if (link1 == link2) {
    return true;
  } else {
    return false;
  }
}
*/
