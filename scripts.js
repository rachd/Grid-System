// css grid feature detection

(function(d){
  var c = " ", f = "grid", fw = "-webkit-"+f, e = d.createElement('b');
  try { 
    e.style.display = fw; 
    e.style.display = f; 
    c += (e.style.display == f || e.style.display == fw) ? f : "no-"+f; 
  } catch(e) { 
    c += "no-"+f; 
  }
  d.documentElement.className += c; 
})(document);