function startBackgroundJS(){
    		$("#startButton").toggle();
      $("#stopButton").toggle();
  let _startURL = document.getElementById('startURLID').value;
  let _domainToTest = document.getElementById('domainToTestID').value;
  let _errorToTest = document.getElementById('lookForID').value;
  let _maxNumberOfPagesToCheck = document.getElementById('maxNumberOfPagesToCheck').value;
  chrome.runtime.sendMessage({greeting: "Start", startURL: _startURL, lookFor: _errorToTest, linksMustContain: _domainToTest, maxNumberOfPagesToCheck: _maxNumberOfPagesToCheck});
}

function stopBackgroundJS(){
  chrome.runtime.sendMessage({greeting: "Stop"});
}

$( document ).ready(function() {
  document.getElementById('startButton').addEventListener('click', startBackgroundJS);
  document.getElementById('stopButton').addEventListener('click', stopBackgroundJS);
  chrome.runtime.sendMessage({greeting: "What is currentPageURL"}, function(response){
    document.getElementById('startURLID').value = response.startPageURL;
    document.getElementById('domainToTestID').value = response.startPageURL;
  });
});

chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          if (request.greeting === "display_results"){
                      document.getElementById('resultsDiv').innerHTML = request.HTMLtoDisplay;
                      addHideEventListener();
                      $("#startButton").toggle();
                      $("#stopButton").toggle();
          }
});

function addHideEventListener(){
  $(".toggleArrow").click(function(){
  		$(this).toggle("fast");
      $(this).siblings().toggle("fast");
  });
}
