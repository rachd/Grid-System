(function(doc){
  var gridClass = " ", grid = "grid", webkitGrid = "-webkit-grid", element = doc.createElement('b');
  try { 
    element.style.display = webkitGrid; 
    element.style.display = grid; 
    gridClass += (element.style.display == grid('') || element.style.display == webkitGrid) ? grid : "no-"+grid; 
  } catch(e) { 
    gridClass += "no-"+grid; 
  }
  doc.documentElement.className += gridClass; 
})(document);