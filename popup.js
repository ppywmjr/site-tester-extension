function startBackgroundJS(){
  var _domainToTest = document.getElementById('domainToTestID').value;
  var _errorToTest = document.getElementById('lookForID').value;
  var _maxNumberOfPagesToCheck = document.getElementById('maxNumberOfPagesToCheck').value;
  chrome.runtime.sendMessage({greeting: "Start", lookFor: _errorToTest, linksMustContain: _domainToTest, maxNumberOfPagesToCheck: _maxNumberOfPagesToCheck});
}



document.getElementById('startButton').addEventListener('click', startBackgroundJS);

chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          if (request.greeting == "display_results"){
                      document.getElementById('resultsDiv').innerHTML = request.HTMLtoDisplay;
          }
        });
