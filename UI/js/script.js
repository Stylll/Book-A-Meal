/**
 * Redirects to a specific page
 * @param {*} location 
 */
const redirectTo = location => {
  window.location.href = location;
}

/**
* Navbar menu trigger on small screen
 */
const expandNav = () => {
  const nav = document.getElementsByTagName('nav')[0];
  if (nav.className.indexOf('responsive') == -1) {
    nav.className += ' responsive';
  }
  else{
    const index = nav.className.indexOf('responsive');
    nav.className = nav.className.substring(0, index);
  }
}

/**
 * Document is ready function
 */
$(document).ready(function(){
  $(".datepicker").datepicker();
});

