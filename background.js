var hasTheTestStarted = false;
var linksArray = [];
var numberOfPagesChecked = 0;
var maxNumberOfPagesToCheck = 10;

chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
        console.log("Request to test page received from content.");
        if (request.greeting == "Should I test?"){
          if (hasTheTestStarted == false){
              console.log("response: No");
              sendResponse({shouldITest: "No"});
          }else{
              sendResponse({shouldITest: "Yes"})
              console.log("response: No");
          }
        }
      });


chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("browser button clicked");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "StartTesting"}, function(response) {

    });
  });
});
