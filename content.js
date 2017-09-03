var contentPageLinksArray = [];

$( document ).ready(function() {
    console.log( "Document ready!" );
    addAllLinksToContentPageLinksArray();
    console.log("sending message to background: Should I test?");
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
        }
      }
    });
});

 function setUpListener(){
        console.log("setUpListener called");
        chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
        sendResponse("test started");
        console.log("extension called from background");
        console.log("greeting is " + request.greeting);
        console.log("testFor is " + request.testFor);
        console.log("nextPage is " + request.nextPage);
        testPage(request.testFor);
        if (request.nextPage != null){
          console.log("next page is not stop");
          loadNextPage(request.nextPage);
        }
      });
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

function loadNextPage(_nextPage){
  console.log("nextPage is: " + _nextPage);
  location.assign( _nextPage );
  //location.href = _nextPage;
  console.log("passed location.assignn");
  setTimeout(function(){location.reload()}, 1000);
  }

function reportErrorToBackground(){
  var currentPageURL = window.location.href;
  console.log("window.location.href is: " + currentPageURL);
  //setTimeout(function(){console.log("waiting")}, 10000);
  chrome.runtime.sendMessage({errorPage: currentPageURL, greeting: "Sending error"}, function(response){});
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
