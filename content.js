//This runs when the button is clicked

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
        console.log("extension called");
//        displayArrayInConsoleLog( request.greeting );
        if (request.sentNumberOfPagesChecked > 0){
          console.log("numberOfPagesChecked >0");
        }else{
          var startPageURL = window.location.href;
          //testWebsite();
          CheckPageForErrors();
          sendResponse({firstPage: startPageURL});

          return true;
        }
//        numberOfPagesChecked = request.sentNumberOfPagesChecked;
//        console.log(numberOfPagesChecked);
//        testWebsite();

//        return true;

});

function testWebsite(){
    console.log("testWebsite called");
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
//<b> Exception Details: </b>
  if (isError > 0){
      console.log("error found")
//    openCopyOfCurrentURLinNewTab();
  }else {
 console.log("error NOT found")
  }
return true;

}

function openCopyOfCurrentURLinNewTab(){
  var currentPageURL = window.location.href;
  window.open(currentPageURL);
}
