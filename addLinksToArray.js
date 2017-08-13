function hrefIsTheSame(link1, link2) {
console.log("hrefIsTheSame called");
  if (link1 == link2) {
    return true;
  } else {
    return false;
  }
}

function ifLinkIsUniqueAppendItToArray(thisLink, thisLinksArray) {
console.log("ifLinkIsUniqueAppendItToArray called");
  var arrayLength = thisLinksArray.length;
  for (x = 0; x < arrayLength; x++) {
    if (hrefIsTheSame(thisLink, thisLinksArray[x])) {
      console.log("duplicate url " + thisLink);
      return;
    }
  }
  console.log( "unique url");
  linksArray.push(thisLink);
}

function AddUniqueURLsToLinksArray(){
  console.log("AddUniqueURLsToLinksArray called");
$("a").each(function() {
  console.log("looked up links");
  var _thisHref = this.href;
  console.log(_thisHref);
  ifLinkIsUniqueAppendItToArray(_thisHref, linksArray);
});
}
