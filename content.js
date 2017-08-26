var contentPageLinksArray = [];

$( document ).ready(function() {
    console.log( "Document ready!" );
    addAllLinksToContentPageLinksArray();
    chrome.runtime.sendMessage({greeting: "Should I test?", currentPageLinks: contentPageLinksArray}, function(response) {
      console.log(response.testFor);
      console.log(response.nextPage);
      testPage(response.testFor);
      go to the next page
//      if (response.shouldITest == "Yes"){
//        testPage();
//      }else{
//        setUpListener();
//      }
    });
});

/*
 function setUpListener(){
      chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
        console.log("extension called");
        testPage();
      });
}
*/

function testPage(error){
    console.log("testPage called");
        CheckPageForErrors();
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

function addAllLinksToContentPageLinksArray(){
  console.log("addAllLinksToContentPageLinksArray");
  var currentPageURL = window.location.href;
  contentPageLinksArray = [currentPageURL];
  addURLsToLinksArray();
  displayArrayInConsoleLog(contentPageLinksArray);
}

function addURLsToLinksArray(){
  console.log("AddUniqueURLsToLinksArray called");
$("a").each(function() {
  console.log("looked up links");
  var _thisHref = this.href;
  console.log(_thisHref);
  linksArray.push(_thisHref);
});
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
