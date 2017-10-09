var _currentPageURL;
var _currentPageDomain;
var contentPageLinksArray;


//document.addEventListener("DOMContentLoaded", ready);
//function ready (){

//option 2 to try
//window.onload = function() {
$( document ).ready(function() {
    console.log( "Document ready!" );
    _currentPageURL = window.location.href;
    _currentPageDomain = window.location.hostname;
    contentPageLinksArray = [];
    addAllLinksToContentPageLinksArray();
    console.log("sending message to background: Should I test?");
    chrome.runtime.sendMessage({greeting: "Should I test?", currentPageLinks: contentPageLinksArray, currentPageURL: _currentPageURL, currentPageDomain: _currentPageDomain}, function(response) {
      console.log("shouldITest response is: " + response.shouldITest);
      console.log("test for: " + response.testFor);
      console.log("next page is: " + response.nextPage);
      if (response.shouldITest === "No"){
        setUpListener();
        return null;
      }
      else{
        testPage(response.testFor);
        if (response.nextPage !== "Stop"){
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
        if (request.nextPage !== null){
          console.log("next page is not stop");
          loadNextPage(request.nextPage);
        }
      });
}

function testPage(errorArray){
     for (let i = 0; i < errorArray.length; i++)
    {
        let isError = $("*:contains('" + a + "')");
        for (let j = 0; j < isError.length; i++) {
            if ($(isError[j]).is(':visible')) {
                reportErrorToBackground();
                return;
            }
        }
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
  $("a:visible").each(function() {
    let _thisHref = this.href;
    if (_thisHref.includes("#!") === false){
      if (_thisHref.includes("#") ){
          _thisHref = _thisHref.split("#")[0];
        }
      }
    contentPageLinksArray.push(_thisHref);
  });
}
