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
        if (response.nextPage != "Stop"){

          loadNextPage(response.nextPage);
        }else{

        }
      }
    });
});

function loadNextPage(_nextPage){
  console.log("nextPage is: " + _nextPage);
  location.assign( _nextPage );
  //location.href = _nextPage;
  console.log("passed location.assignn");
  setTimeout(function(){location.reload()}, 1000);
  }

 function setUpListener(){
        console.log("setUpListener called");
        chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
        console.log("extension called from background");
        console.log("greeting is " + request.greeting);
        console.log("testFor is " + request.testFor);
        console.log("nextPage is " + request.nextPage);
        testPage(request.testFor);
        if (request.nextPage == "Stop"){
          return null;
        }else{
          console.log("next page is not stop");
        //  location.assign(request.nextPage);
        //  location.reload();
          loadNextPage(request.nextPage);
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
  console.log("Number of errors on page is " + isError.toString());
  if (isError > 0){
      console.log("error found")
      reportErrorToBackground();
  }else {
      console.log("error NOT found")
  }
}

function reportErrorToBackground(){
  var currentPageURL = window.location.href;
  console.log("window.location.href is: " + currentPageURL);
    chrome.runtime.sendMessage({errorPage: currentPageURL, greeting: "sending error"}, function(response) {});
}
