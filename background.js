var hasTheTestStarted = false;
var linksArray = ["nothing"];
var numberOfPagesChecked = 0;
var maxNumberOfPagesToCheck = 10;
var lookFor = "output";



chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
        console.log("Request to test page received from content.");
        if (request.greeting == "Should I test?"){
          if (hasTheTestStarted == false){
              console.log("response: No");
              sendResponse({shouldITest: "No"});
          }else{
              console.log("response: yes");
              sendResponse({shouldITest: "Yes", testFor: lookFor, nextPage: linksArray[numberOfPagesChecked]});
          }
        }
      });


chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("browser button clicked");
    hasTheTestStarted = true;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "StartTesting", testFor: lookFor, nextPage: linksArray[numberOfPagesChecked]}, function(response) {

    });
  });
});
