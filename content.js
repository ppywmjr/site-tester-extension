var contentPageLinksArray = [];

$( document ).ready(function() {
    console.log( "Document ready!" );
    addAllLinksToContentPageLinksArray();
    console.log("sending message to background");
    chrome.runtime.sendMessage({greeting: "Should I test?", currentPageLinks: contentPageLinksArray}, function(response) {
      console.log(response.shouldITest);
      console.log(response.testFor);
      console.log(response.nextPage);
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
        }
      });
}


function addAllLinksToContentPageLinksArray(){
  console.log("addAllLinksToContentPageLinksArray called");
  var currentPageURL = window.location.href;
  contentPageLinksArray = [currentPageURL];
  addURLsToLinksArray();
  displayArrayInConsoleLog(contentPageLinksArray);
}

function addURLsToLinksArray(){
  console.log("AddUniqueURLsToLinksArray called");
$("a").each(function() {
  //console.log("looked up next link");
  var _thisHref = this.href;
  //console.log(_thisHref);
  contentPageLinksArray.push(_thisHref);
});
}

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
