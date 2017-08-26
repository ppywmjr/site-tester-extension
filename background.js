var isTestRunning = false;
var linksArray = ["http://www.catherinetaylordance.co.uk", "http://www.catherinetaylordance.co.uk/about/", "http://www.catherinetaylordance.co.uk/contact/"];
var numberOfPagesChecked = 0;
var maxNumberOfPagesToCheck = 2;
var lookFor = "output";



chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
        console.log("Request to test page received from content.");
        if (request.greeting == "Should I test?"){
          if (isTestRunning == false){
              console.log("response: No");
              sendResponse({shouldITest: "No"});
          }else if (numberOfPagesChecked == maxNumberOfPagesToCheck){
            console.log("maxNumberOfPagesToCheck reached");
            isTestRunning = false;
            sendResponse({shouldITest: "No"});
          }else {
              console.log("response: yes");
              sendResponse({shouldITest: "Yes", testFor: lookFor, nextPage: linksArray[numberOfPagesChecked]});
              numberOfPagesChecked = numberOfPagesChecked + 1;
              console.log(numberOfPagesChecked);
          }
        }
      });


chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("browser button clicked");
    isTestRunning = true;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "StartTesting", testFor: lookFor, nextPage: linksArray[numberOfPagesChecked]}, function(response) {

    });
  });
});
