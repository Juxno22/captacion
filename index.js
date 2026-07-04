const API_BASE_URL = 'https://captacion.up.railway.app/api';

const loginForm = document.getElementById('loginForm');
const loginWrap = document.getElementById('loginWrap');
const appWrap = document.getElementById('appWrap');
const logoutBtn = document.getElementById('logoutBtn');

const codigoInput = document.getElementById('codigoEmpleado');
const codigoDisplay = document.getElementById('codigoDisplay');

const clientForm = document.getElementById('clientForm');
const formCard = document.getElementById('formCard');
const successCard = document.getElementById('successCard');
const newClientBtn = document.getElementById('newClientBtn');

function mostrarApp(codigoEmpleado) {
  codigoInput.value = codigoEmpleado;
  codigoDisplay.textContent = codigoEmpleado;

  loginWrap.classList.add('hidden');
  appWrap.classList.add('active');
}

function mostrarLogin() {
  appWrap.classList.remove('active');
  loginWrap.classList.remove('hidden');

  loginForm.reset();
  codigoDisplay.textContent = '';

  localStorage.removeItem('codigoEmpleado');
}

function mostrarExito() {
  formCard.style.display = 'none';
  successCard.classList.add('active');
}

function mostrarFormularioNuevo() {
  clientForm.reset();
  successCard.classList.remove('active');
  formCard.style.display = 'block';
}

async function loginEmpleado(codigoEmpleado) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ codigoEmpleado })
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'No se pudo iniciar sesión.');
  }

  return data;
}

async function guardarProspecto(payload) {
  const response = await fetch(`${API_BASE_URL}/prospectos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    console.error('Error backend:', data);
    throw new Error(data.error || 'No se pudo guardar el prospecto.');
  }

  return data;
}

window.addEventListener('DOMContentLoaded', () => {
  const savedCodigo = localStorage.getItem('codigoEmpleado');

  if (savedCodigo) {
    mostrarApp(savedCodigo);
  }
});

loginForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const codigo = codigoInput.value.trim().toUpperCase();

  if (codigo === '') {
    alert('Por favor, ingresa tu código de empleado.');
    return;
  }

  const submitBtn = loginForm.querySelector('button[type="submit"]');

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Validando...';

    await loginEmpleado(codigo);

    localStorage.setItem('codigoEmpleado', codigo);
    mostrarApp(codigo);
  } catch (error) {
    alert(error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Iniciar sesión';
  }
});

logoutBtn.addEventListener('click', function () {
  mostrarLogin();
});

clientForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const codigoEmpleado = localStorage.getItem('codigoEmpleado');

  if (!codigoEmpleado) {
    alert('No hay código de empleado activo. Inicia sesión nuevamente.');
    mostrarLogin();
    return;
  }

  const formData = new FormData(clientForm);

  const payload = {
    codigoEmpleado,
    nombreCliente: formData.get('nombreCliente'),
    origen: formData.get('origen'),
    giro: formData.get('giro'),
    telefono: formData.get('telefono'),
    email: formData.get('email'),
    razonSocial: formData.get('razonSocial'),
    tipoPersona: formData.get('tipoPersona'),
    aniosEmpresa: formData.get('aniosEmpresa'),
    aniosExperiencia: formData.get('aniosExperiencia'),
    sucursales: formData.get('sucursales'),
    acompaniantes: formData.get('acompaniantes'),
    proveedores: formData.get('proveedores'),
    metodoCompra: formData.get('metodoCompra'),
    diasPlazo: formData.get('diasPlazo'),
    sistemas: formData.getAll('sistemas'),
    especializacion: formData.get('especializacion'),
    potencial: formData.get('potencial')
  };

  const submitBtn = clientForm.querySelector('button[type="submit"]');

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    await guardarProspecto(payload);

    mostrarExito();
  } catch (error) {
    alert(error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Guardar prospecto';
  }
});

newClientBtn.addEventListener('click', function () {
  mostrarFormularioNuevo();
});