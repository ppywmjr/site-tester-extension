function doesThisPageLinkToThisURL(_thisURL, _thisPagesLinksArray){
  var numberOfLinks = _thisPagesLinksArray.length;
  for(var i = 0; i < numberOfLinks; i++){
    if (_thisPagesLinksArray[i] == _thisURL){
      return true;
    }
  }
  return false;
}

function whichPagesHaveThisLink(_thisURL, _thisArrayOfLinksOnPages){
  var numberOfPages = _thisArrayOfLinksOnPages.length;
  var pagesThatHaveTheLink = [];
  for(var i = 0; i < numberOfPages; i++){
    var arrayOfPageAndItsLinks = _thisArrayOfLinksOnPages[i];
    if (doesThisPageLinkToThisURL(_thisURL, arrayOfPageAndItsLinks[1])){
      pagesThatHaveTheLink.push(arrayOfPageAndItsLinks[0]);
    }
  }
  return pagesThatHaveTheLink;
}

function matchErrorPagesWithPagesThatLinkToThem(_errorURLsArray , _thisArrayOfLinksOnPages, _arrayOfPagesWithError, _errorsAndTheirLinksArray){
  var numberOfErrorsFound = _arrayOfPagesWithError.length;
  for (let i = 0; i < numberOfErrorsFound; i++){
    var thisErrorURL = _errorURLsArray[i];
    var isOnThesePages = whichPagesHaveThisLink(thisErrorURL, _thisArrayOfLinksOnPages);
    _errorsAndTheirLinksArray.push([thisErrorURL, isOnThesePages]);
  }
  return _errorsAndTheirLinksArray;
}

function convertErrorsAndTheirLinksArrayToHTML(_errorsAndTheirLinksArray, _numberOfPagesChecked){
  let printThis = "";
  let numberOfErrorsFound = _errorsAndTheirLinksArray.length;
    printThis += _numberOfPagesChecked.toString() + " pages skimmed."
    printThis += "<br>" + numberOfErrorsFound.toString() + " results found."
  if (numberOfErrorsFound > 0){
    printThis += "<h1>Results found:</h1><ul>";
    for(let i = 0; i < numberOfErrorsFound; i++){
      let thisErrorURLAndLinks = _errorsAndTheirLinksArray[i];
      let thisErrorURL = thisErrorURLAndLinks[0];
      let itsLinks = thisErrorURLAndLinks[1];
      let numberOfLinks = itsLinks.length;
      printThis += "<li>Error link is: ";
      printThis += "<a href='" + thisErrorURL + "' target='_blank'>" + thisErrorURL + "</a>";
      printThis += "<div class='errorPageLinksP'><span name='downArrow' class='startHidden toggleArrow' >&#9660; Pages that link to it are:</span></span><span class='toggleArrow'>&#9650; details</span>	<div class='startHidden'><br>";
      for (let j = 0; j < numberOfLinks; j++ ){
        printThis += "<a href='" + itsLinks[j] + "' target='_blank'>" + itsLinks[j] + "</a><br>";
      }
      printThis += "</div></div></li>";
    }
  }
  printThis += "</ul>";
  return printThis;
}
