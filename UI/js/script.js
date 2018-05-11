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
 * Handler for navigation dropdown menu
 * This toggles the dropdown content of a navigation item
 */
const toggleNav = (link) => {
  const item = link.nextElementSibling;
  if (item.className.indexOf('show') == -1) {
    item.className = `${item.className} show`;
  }
  else {
    item.className  = 'dropdown-content';
  }
  return false;
}

/**
 * Handler for closing navigation dropdown
 * Listens for clicks outside dropdown and closes it
 */
window.onclick = () => {
  if (!event.target.matches('.dropdown-content')) {
    listOfDropdowns = document.getElementsByClassName('.dropdown-content');

    for (let i = 0; i < listOfDropdowns.length; i++) {
      listOfDropdowns[i].className = 'dropdown-content'
    }
  }
}

/**
 * Document is ready function
 */
$(document).ready(function(){
  $(".datepicker").datepicker();
});


