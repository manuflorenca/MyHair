const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const wrapper = document.querySelector('.wrapper');
const btnPopup = document.querySelector('#btnPopup');
const iconClose = document.querySelector('.icon-close');
const loginLink = document.querySelector('.login-link');



// Troca de loguin e cadastro

btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});


iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});


// registerLink.addEventListener('click', () => {
//     wrapper.classList.add('active');
// });


loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});





