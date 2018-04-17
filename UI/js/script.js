/**
 * Redirects to a specific page
 * @param {*} location 
 */
const redirectTo = location => {
  window.location.href = location;
}

/**
 * Document is ready function
 */
$(document).ready(function(){
  $(".datepicker").datepicker();
});
