function startBackgroundJS(){
  var _startURL = document.getElementById('startURLID').value;
  var _domainToTest = document.getElementById('domainToTestID').value;
  var _errorToTest = document.getElementById('lookForID').value;
  var _maxNumberOfPagesToCheck = document.getElementById('maxNumberOfPagesToCheck').value;
  console.log(_domainToTest + _errorToTest + _maxNumberOfPagesToCheck);
  chrome.runtime.sendMessage({greeting: "Start", startURL: _startURL, lookFor: _errorToTest, linksMustContain: _domainToTest, maxNumberOfPagesToCheck: _maxNumberOfPagesToCheck});
}


$( document ).ready(function() {
document.getElementById('startButton').addEventListener('click', startBackgroundJS);
});

chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          if (request.greeting == "display_results"){
                      document.getElementById('resultsDiv').innerHTML = request.HTMLtoDisplay;
          }
});
