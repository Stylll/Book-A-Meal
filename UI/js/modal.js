/**
  Js script to handle modal popups and close
 */

// get the modal element
const modal = document.getElementById('modal');

// function to popup modal box
const modalPopup = () => {
  modal.style.display = 'block';
};

// function to close modal box
const modalClosePopup = () => {
  modal.style.display = 'none';
};

// function to close modal if area outside modal box is clicked
window.onclick = () => {
  if(event.target == modal) {
    modal.style.display = 'none';
  }
}
