//this will add an action to the button on the browser bar
var linksArray = [];
var numberOfPagesChecked = 0;
var maxNumberOfPagesToCheck = 10;
//var nextPageToTest

chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("browser button clicked");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {sentNumberOfPagesChecked: numberOfPagesChecked}, function(response) {
      var messageReceived = response.firstPage;
      console.log(messageReceived);
      linksArray = [messageReceived];


    });
  });

});

function testNextPage(page){

}
