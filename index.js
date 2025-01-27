const toggle = document.querySelector('.toggle input');
const body = document.querySelector("body");
const buttons = document.querySelectorAll("button");

toggle.addEventListener('change', () => {
  body.classList.toggle('dark');
  buttons.forEach((btn)=>{btn.classList.toggle('dark');});
});