function startBackgroundJS(){
    		$("#startButton").toggle();
      $("#stopButton").toggle();
  let _startURL = document.getElementById('startURLID').value;
  let _domainToTest = document.getElementById('domainToTestID').value;
  let _linksToAvoid = document.getElementById('linksToAvoidID').value;
  let _errorsToTest = [];
  let tempErrorsToTest = [];
    tempErrorsToTest[0] = document.getElementById('lookForID1').value;
    tempErrorsToTest[1] = document.getElementById('lookForID2').value;
    tempErrorsToTest[2] = document.getElementById('lookForID3').value;
    tempErrorsToTest[3] = document.getElementById('lookForID4').value;
    tempErrorsToTest[4] = document.getElementById('lookForID5').value;
  $.each(tempErrorsToTest, function(index, value) {
      if (value !== ""){_errorsToTest.push(value);}
  });
  let _errorsToTestJSON = JSON.stringify(_errorsToTest);
  let _maxNumberOfPagesToCheck = document.getElementById('maxNumberOfPagesToCheck').value;
  chrome.runtime.sendMessage({greeting: "Start", startURL: _startURL, lookFor: _errorsToTestJSON, linksMustContain: _domainToTest, linksMustNotContain: _linksToAvoid, maxNumberOfPagesToCheck: _maxNumberOfPagesToCheck});
}

function stopBackgroundJS(){
  chrome.runtime.sendMessage({greeting: "Stop"});
}

$( document ).ready(function() {
  document.getElementById('startButton').addEventListener('click', startBackgroundJS);
  document.getElementById('stopButton').addEventListener('click', stopBackgroundJS);
  chrome.runtime.sendMessage({greeting: "What is currentPageURL"}, function(response){
    document.getElementById('startURLID').value = response.startPageURL;
    document.getElementById('domainToTestID').value = response.startPageDomain;
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
