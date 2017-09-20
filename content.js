var _currentPageURL = window.location.href;
//var contentPageSet = new Set(_currentPageURL);
var contentPageLinksArray = [_currentPageURL];

$( document ).ready(function() {
    console.log( "Document ready!" );
    addAllLinksToContentPageLinksArray();
    console.log("sending message to background: Should I test?");
    chrome.runtime.sendMessage({greeting: "Should I test?", currentPageLinks: contentPageLinksArray, currentPageURL: _currentPageURL}, function(response) {
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
      } else {
            chrome.runtime.sendMessage({greeting: "Should I test?", currentPageLinks: []});
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
  var isError = $( "*:contains('" + error + "')" ).length;
  if (isError > 0){
      reportErrorToBackground();
  }else {
  }
}

$.expr[":"].contains = $.expr.createPseudo(function(arg) {
  return function( elem ) {
   return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
  };
});


function loadNextPage(_nextPage){
  window.location.assign( _nextPage );
  console.log("passed location.assignn");
  setTimeout(function(){console.log("waited 1000")}, 1000);
  }

function reportErrorToBackground(){
  let currentPageURL = window.location.href;
  chrome.runtime.sendMessage({errorPage: currentPageURL, greeting: "Sending error"});
}

function addAllLinksToContentPageLinksArray(){
  console.log("addAllLinksToContentPageLinksArray called");
  $("a").each(function() {
    var _thisHref = this.href;
    if (_thisHref.includes("#!") == false){
      if (_thisHref.includes("#") ){
          _thisHref = _thisHref.split("#")[0];
        }
      }
    contentPageLinksArray.push(_thisHref);
  });
}
