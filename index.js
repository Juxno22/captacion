const loginForm = document.getElementById('loginForm');
const loginWrap = document.getElementById('loginWrap');
const appWrap = document.getElementById('appWrap');
const logoutBtn = document.getElementById('logoutBtn');

const codigoInput = document.getElementById('codigoEmpleado');

window.addEventListener('DOMContentLoaded', () =>{
    const savedCodigo = localStorage.getItem('codigoEmpleado');
    if(savedCodigo){
        codigoInput.value = savedCodigo;
        document.getElementById('codigoDisplay').textContent = savedCodigo;

        loginWrap.classList.add('hidden');
        appWrap.classList.add('active');
    }
});

loginForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const codigo = codigoInput.value.trim().toUpperCase();
  if (codigo === '') {
    alert('Por favor, ingresa tu código de empleado.');
    return;
  }
  localStorage.setItem('codigoEmpleado', codigo);

  document.getElementById('codigoDisplay').textContent = codigo;

  loginWrap.classList.add('hidden');
  appWrap.classList.add('active');
});

logoutBtn.addEventListener('click', function () {
    appWrap.classList.remove('active');
    loginWrap.classList.remove('hidden');
    loginForm.reset();

    document.getElementById('codigoDisplay').textContent = '';
    localStorage.removeItem('codigoEmpleado');
});

const clientForm = document.getElementById('clientForm');
const formCard = document.getElementById('formCard');
const successCard = document.getElementById('successCard');
const newClientBtn = document.getElementById('newClientBtn');

clientForm.addEventListener('submit', function (event) {
    event.preventDefault();
    formCard.style.display = 'none';
    successCard.classList.add('active');
});

newClientBtn.addEventListener('click', function () {
    clientForm.reset();
    successCard.classList.remove('active');
    formCard.style.display = 'block';
});