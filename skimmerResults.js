function addListOfPagesSkimmedToHtml(_arrayOfLinks, _numberOfPagesChecked){
  let printThis = "";
  printThis += "<div class='errorPageLinksP'>";
  printThis += "<span name='downArrow' class='startHidden toggleArrow' >&#9660; Pages skimmed are:</span>";
  printThis += "<span class='toggleArrow'>&#9650; details</span>";
  printThis += "<div class='startHidden'><br>";
  for (let j = 0; j < _numberOfPagesChecked; j++ ){
    printThis += "<a href='" + _arrayOfLinks[j] + "' target='_blank'>" + _arrayOfLinks[j] + "</a>";
  }
  printThis += "</div></div>";
  return printThis;
}

function doesThisPageLinkToThisURL(_thisURL, _thisPagesLinksArray){
  let numberOfLinks = _thisPagesLinksArray.length;
  for(let i = 0; i < numberOfLinks; i++){
    if (_thisPagesLinksArray[i] === _thisURL){
      return true;
    }
  }
  return false;
}

function whichPagesHaveThisLink(_thisURL, _thisArrayOfLinksOnPages){
  let numberOfPages = _thisArrayOfLinksOnPages.length;
  let pagesThatHaveTheLink = [];
  for(let i = 0; i < numberOfPages; i++){
    let arrayOfPageAndItsLinks = _thisArrayOfLinksOnPages[i];
    if (doesThisPageLinkToThisURL(_thisURL, arrayOfPageAndItsLinks[1])){
      pagesThatHaveTheLink.push(arrayOfPageAndItsLinks[0]);
    }
  }
  return pagesThatHaveTheLink;
}

function matchErrorPagesWithPagesThatLinkToThem(_errorURLsArray , _thisArrayOfLinksOnPages, _arrayOfPagesWithError, _errorsAndTheirLinksArray){
  let numberOfErrorsFound = _arrayOfPagesWithError.length;
  for (let i = 0; i < numberOfErrorsFound; i++){
    let thisErrorURL = _errorURLsArray[i];
    let isOnThesePages = whichPagesHaveThisLink(thisErrorURL, _thisArrayOfLinksOnPages);
    _errorsAndTheirLinksArray.push([thisErrorURL, isOnThesePages]);
  }
  return _errorsAndTheirLinksArray;
}

function convertErrorsAndTheirLinksArrayToHTML(_errorsAndTheirLinksArray, _numberOfPagesChecked, _linksSet){
  let _linksArray = [..._linksSet];
  let printThis = "";
  let numberOfErrorsFound = _errorsAndTheirLinksArray.length;
    printThis += "<ul>";
    printThis += "<li>" + _numberOfPagesChecked.toString() + " pages skimmed.";
    printThis += "<br>" + numberOfErrorsFound.toString() + " results found.";
    printThis += addListOfPagesSkimmedToHtml(_linksArray, _numberOfPagesChecked);
    printThis += "</li>";

    for(let i = 0; i < numberOfErrorsFound; i++){
      let thisErrorURLAndLinks = _errorsAndTheirLinksArray[i];
      let thisErrorURL = thisErrorURLAndLinks[0];
      let itsLinks = thisErrorURLAndLinks[1];
      let numberOfLinks = itsLinks.length;
      printThis += "<li>";
      printThis += "<a href='" + thisErrorURL + "' target='_blank'>" + thisErrorURL + "</a>";
      printThis += "<div class='errorPageLinksP'><span name='downArrow' class='startHidden toggleArrow' >&#9660; Pages that link to it are:</span></span><span class='toggleArrow'>&#9650; details</span>	<div class='startHidden'><br>";
      for (let j = 0; j < numberOfLinks; j++ ){
        printThis += "<a href='" + itsLinks[j] + "' target='_blank'>" + itsLinks[j] + "</a>";
      }
      printThis += "</div></div></li>";
    }
  printThis += "</ul>";
  return printThis;
}
