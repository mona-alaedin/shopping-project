const singIn = document.querySelector(".sing-in");
const modal = document.querySelector(".modal");
const backdrop = document.querySelector(".backdrop");
const closeIcon= document.querySelector(".bi-x-circle");

singIn.addEventListener("click", showModalFunction);
backdrop.addEventListener("click", closeModalFunction);
closeIcon.addEventListener("click", closeModalFunction);

function showModalFunction() {
  backdrop.style.display = "block";
  modal.style.top = "50%";
  modal.style.opacity = "1";
}
function closeModalFunction() {
  backdrop.style.display = "none";
  modal.style.top = "-100%";
  modal.style.opacity = "0";
}