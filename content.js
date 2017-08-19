var linksArray = [];

$( document ).ready(function() {
    console.log( "Document ready!" );
    chrome.runtime.sendMessage({greeting: "Should I test?"}, function(response) {
      console.log(response.shouldITest);
      if (response.shouldITest == "Yes"){
        sendPageLinksToBackground();
        testPage();
      }else{
        setUpListener();
      }
    });
});

function setUpListener(){
      chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
        console.log("extension called");
        testPage();
      });
}

function testPage(){
    console.log("testPage called");
        CheckPageForErrors();
        AddUniqueURLsToLinksArray();
        displayArrayInConsoleLog(linksArray);
}

function displayArrayInConsoleLog( _thisArray ){
  console.log("displayArrayInConsoleLog called");
  var thisArrayLength = _thisArray.length;
  for (x = 0; x < thisArrayLength; x++) {
    console.log( _thisArray[x] );
  }
}


function CheckPageForErrors(){
  console.log("CheckPageForErrors called")
  var isError = $( "*:contains('Stack Trace')" ).length;
  console.log(isError.toString());
  if (isError > 0){
      console.log("error found")

  }else {
      console.log("error NOT found")
  }
return true;
}

function sendPageLinksToBackground(){
  var currentPageURL = window.location.href;
  linksArray = [currentPageURL];
  AddUniqueURLsToLinksArray();
}

/*
function openCopyOfCurrentURLinNewTab(){
  var currentPageURL = window.location.href;
  window.open(currentPageURL);
}*/
function reportErrorToBackground(){
  var currentPageURL = window.location.href;
  linksArray = [currentPageURL];

}