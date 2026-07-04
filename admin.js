const API_BASE_URL = 'http://localhost:4000/api';
const ADMIN_STORAGE_KEY = 'adminCodigoEmpleado';

const adminLoginWrap = document.getElementById('adminLoginWrap');
const adminWrap = document.getElementById('adminWrap');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminCodigoEmpleado = document.getElementById('adminCodigoEmpleado');
const adminCodigoDisplay = document.getElementById('adminCodigoDisplay');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');

const fechaResumen = document.getElementById('fechaResumen');
const fechaDesde = document.getElementById('fechaDesde');
const fechaHasta = document.getElementById('fechaHasta');
const searchInput = document.getElementById('searchInput');
const potencialFilter = document.getElementById('potencialFilter');

const refreshBtn = document.getElementById('refreshBtn');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const exportBtn = document.getElementById('exportBtn');

const dateChip = document.getElementById('dateChip');

const kpiTotal = document.getElementById('kpiTotal');
const kpiAlto = document.getElementById('kpiAlto');
const kpiCapturistas = document.getElementById('kpiCapturistas');
const kpiAcompaniantes = document.getElementById('kpiAcompaniantes');

const potencialAltoText = document.getElementById('potencialAltoText');
const potencialMedioText = document.getElementById('potencialMedioText');
const potencialBajoText = document.getElementById('potencialBajoText');

const barAlto = document.getElementById('barAlto');
const barMedio = document.getElementById('barMedio');
const barBajo = document.getElementById('barBajo');

const compraContado = document.getElementById('compraContado');
const compraCredito = document.getElementById('compraCredito');
const compraMixto = document.getElementById('compraMixto');

const capturistasList = document.getElementById('capturistasList');
const girosList = document.getElementById('girosList');
const origenList = document.getElementById('origenList');
const sistemasList = document.getElementById('sistemasList');

const prospectosTbody = document.getElementById('prospectosTbody');
const tableResume = document.getElementById('tableResume');
const pageInfo = document.getElementById('pageInfo');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');

let currentPage = 1;
let totalPages = 1;

function getTodayLocal() {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000);

    return localDate.toISOString().slice(0, 10);
}

function formatDateTime(value) {
    if (!value) return '-';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString('es-MX', {
        dateStyle: 'short',
        timeStyle: 'short'
    });
}

function getBadgeClass(value) {
    if (value === 'Alto') return 'high';
    if (value === 'Medio') return 'medium';
    if (value === 'Bajo') return 'low';

    return 'neutral';
}

function setText(element, value) {
    element.textContent = value ?? 0;
}

function mostrarAdmin(codigoEmpleado) {
    adminCodigoDisplay.textContent = codigoEmpleado;

    adminLoginWrap.classList.add('hidden');
    adminWrap.classList.add('active');
}

function mostrarLoginAdmin() {
    adminWrap.classList.remove('active');
    adminLoginWrap.classList.remove('hidden');

    adminCodigoEmpleado.value = '';
    adminCodigoDisplay.textContent = '';

    localStorage.removeItem(ADMIN_STORAGE_KEY);
}

async function loginAdmin(codigoEmpleado) {
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

function getFiltros() {
    return {
        fechaResumen: fechaResumen.value || getTodayLocal(),
        desde: fechaDesde.value || getTodayLocal(),
        hasta: fechaHasta.value || fechaDesde.value || getTodayLocal(),
        q: searchInput.value.trim(),
        potencial: potencialFilter.value
    };
}

function buildQueryParams(params) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && String(value).trim() !== '') {
            query.set(key, value);
        }
    });

    return query.toString();
}

function renderRankList(container, items, labelKey, totalKey = 'total') {
    container.innerHTML = '';

    if (!items || items.length === 0) {
        container.innerHTML = '<div class="empty-state">Sin información para mostrar.</div>';
        return;
    }

    items.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'rank-item';

        const label = item[labelKey] || 'Sin dato';
        const total = item[totalKey] || 0;

        row.innerHTML = `
      <span>${label}</span>
      <strong>${total}</strong>
    `;

        container.appendChild(row);
    });
}

async function fetchJson(url) {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || !data.ok) {
        throw new Error(data.error || 'No se pudo obtener la información.');
    }

    return data;
}

async function cargarResumen() {
    const filtros = getFiltros();

    const data = await fetchJson(
        `${API_BASE_URL}/admin/resumen?${buildQueryParams({
            fecha: filtros.fechaResumen
        })}`
    );

    const resumen = data.resumen;
    const graficas = data.graficas;

    dateChip.textContent = `Resumen: ${data.fecha}`;

    setText(kpiTotal, resumen.totalProspectos);
    setText(kpiAlto, resumen.potencialAlto);
    setText(kpiCapturistas, resumen.capturistasActivos);
    setText(kpiAcompaniantes, resumen.totalAcompaniantes);

    setText(potencialAltoText, resumen.potencialAlto);
    setText(potencialMedioText, resumen.potencialMedio);
    setText(potencialBajoText, resumen.potencialBajo);

    const totalPotencial =
        Number(resumen.potencialAlto || 0) +
        Number(resumen.potencialMedio || 0) +
        Number(resumen.potencialBajo || 0);

    const altoPercent = totalPotencial ? (resumen.potencialAlto / totalPotencial) * 100 : 0;
    const medioPercent = totalPotencial ? (resumen.potencialMedio / totalPotencial) * 100 : 0;
    const bajoPercent = totalPotencial ? (resumen.potencialBajo / totalPotencial) * 100 : 0;

    barAlto.style.width = `${altoPercent}%`;
    barMedio.style.width = `${medioPercent}%`;
    barBajo.style.width = `${bajoPercent}%`;

    setText(compraContado, resumen.compraContado);
    setText(compraCredito, resumen.compraCredito);
    setText(compraMixto, resumen.compraMixto);

    renderRankList(capturistasList, graficas.porCapturista, 'capturista');
    renderRankList(girosList, graficas.porGiro, 'giro');
    renderRankList(origenList, graficas.porOrigen, 'origen');
    renderRankList(sistemasList, graficas.porSistema, 'sistema');
}

async function cargarProspectos() {
    const filtros = getFiltros();

    prospectosTbody.innerHTML = `
    <tr>
      <td colspan="8">Cargando clientes...</td>
    </tr>
  `;

    const data = await fetchJson(
        `${API_BASE_URL}/admin/prospectos?${buildQueryParams({
            desde: filtros.desde,
            hasta: filtros.hasta,
            q: filtros.q,
            potencial: filtros.potencial,
            page: currentPage,
            limit: 20
        })}`
    );

    totalPages = Math.max(Number(data.totalPages || 1), 1);

    tableResume.textContent = `${data.total} registros encontrados`;
    pageInfo.textContent = `Página ${data.page} de ${totalPages}`;

    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;

    prospectosTbody.innerHTML = '';

    if (!data.prospectos || data.prospectos.length === 0) {
        prospectosTbody.innerHTML = `
      <tr>
        <td colspan="8">No hay clientes captados con los filtros seleccionados.</td>
      </tr>
    `;
        return;
    }

    data.prospectos.forEach((prospecto) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
      <td>${formatDateTime(prospecto.created_at)}</td>
      <td>
        <strong>${prospecto.nombreProspecto || '-'}</strong><br>
        <small>${prospecto.email || '-'}</small>
      </td>
      <td>${prospecto.telefono || '-'}</td>
      <td>${prospecto.giro || '-'}</td>
      <td>${prospecto.origen || '-'}</td>
      <td>
        <span class="badge ${getBadgeClass(prospecto.potencial)}">
          ${prospecto.potencial || 'Sin definir'}
        </span>
      </td>
      <td>${prospecto.metodoCompra || '-'}</td>
      <td>
        <strong>${prospecto.codigoEmpleadoUsado || '-'}</strong><br>
        <small>${prospecto.capturista || '-'}</small>
      </td>
    `;

        prospectosTbody.appendChild(tr);
    });
}

async function cargarDashboard() {
    try {
        await Promise.all([
            cargarResumen(),
            cargarProspectos()
        ]);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

function exportarExcel() {
    const filtros = getFiltros();

    const url = `${API_BASE_URL}/admin/prospectos/export?${buildQueryParams({
        desde: filtros.desde,
        hasta: filtros.hasta,
        q: filtros.q,
        potencial: filtros.potencial
    })}`;

    window.open(url, '_blank');
}

window.addEventListener('DOMContentLoaded', () => {
    const today = getTodayLocal();

    fechaResumen.value = today;
    fechaDesde.value = today;
    fechaHasta.value = today;

    const savedCodigo = localStorage.getItem(ADMIN_STORAGE_KEY);

    if (savedCodigo) {
        mostrarAdmin(savedCodigo);
        cargarDashboard();
    }
});

adminLoginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const codigoEmpleado = adminCodigoEmpleado.value.trim().toUpperCase();

    if (!codigoEmpleado) {
        alert('Ingresa tu código de empleado.');
        return;
    }

    const submitBtn = adminLoginForm.querySelector('button[type="submit"]');

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Validando...';

        await loginAdmin(codigoEmpleado);

        localStorage.setItem(ADMIN_STORAGE_KEY, codigoEmpleado);

        mostrarAdmin(codigoEmpleado);
        cargarDashboard();
    } catch (error) {
        alert(error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Entrar al admin';
    }
});

adminLogoutBtn.addEventListener('click', () => {
    mostrarLoginAdmin();
});

refreshBtn.addEventListener('click', () => {
    cargarDashboard();
});

applyFiltersBtn.addEventListener('click', () => {
    currentPage = 1;
    cargarDashboard();
});

exportBtn.addEventListener('click', () => {
    exportarExcel();
});

prevPageBtn.addEventListener('click', () => {
    if (currentPage <= 1) return;

    currentPage -= 1;
    cargarProspectos();
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage >= totalPages) return;

    currentPage += 1;
    cargarProspectos();
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        currentPage = 1;
        cargarDashboard();
    }
});