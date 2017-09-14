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
  chrome.runtime.sendMessage({greeting: "What is currentPageURL"}, function(response){
    document.getElementById('startURLID').value = response.startPageURL;
    document.getElementById('domainToTestID').value = response.startPageURL;
  });
});

chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          if (request.greeting == "display_results"){
                      document.getElementById('resultsDiv').innerHTML = request.HTMLtoDisplay;
          }
});

/*
THIS
$("#hide").click(function(){
    $("p").hide();
});

$("#show").click(function(){
    $("p").show();
});


OR THIS
var classname = document.getElementsByClassName("classname");

var myFunction = function() {
    var attribute = this.getAttribute("data-myattribute");
    alert(attribute);
};

for (var i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', myFunction, false);
}

OR EVEN
$(".yourButtonClass").on('click', function(event){
    event.stopPropagation();
    event.stopImmediatePropagation();
    //(... rest of your JS code)
});
*/
