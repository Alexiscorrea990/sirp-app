// ========================================
//   DATOS
// ========================================
const actasData = [
    { id: 1, titulo: 'Acta de procedimiento — Ruta 11 km 42', fecha: 'Hoy 08:45', autor: 'Subof. Gómez', jurisdiccion: 'Gendarmería Clorinda', estado: 'Validada', tipo: 'procedimiento' },
    { id: 2, titulo: 'Cadena de custodia — Secuestro #014', fecha: 'Ayer 22:10', autor: 'Subof. Rodríguez', jurisdiccion: 'Policía Formosa', estado: 'Incompleta', tipo: 'custodia' },
    { id: 3, titulo: 'Acta de requisa — Terminal de ómnibus', fecha: '03/05/2026', autor: 'Cabo Díaz', jurisdiccion: 'Gendarmería Formosa', estado: 'Validada', tipo: 'requisa' },
    { id: 4, titulo: 'Informe judicial — Fiscalía N°3', fecha: '02/05/2026', autor: 'Of. Pérez', jurisdiccion: 'Gendarmería Nacional', estado: 'Error', tipo: 'constatacion' },
];

const alertsData = [
    { tipo: 'error', mensaje: 'Informe judicial #047 tiene campos obligatorios vacíos — revisar firma y fiscalía asignada.' },
    { tipo: 'warning', mensaje: 'Cadena de custodia #014 sin firma de testigo. Se sugiere completar antes de imprimir.' },
    { tipo: 'info', mensaje: 'Acta de requisa #039 generada. ¿Desea crear inventario complementario?' },
];

const historialData = [
    { id: 47, titulo: 'Acta de procedimiento #047', fecha: '06/05/2026', tipo: 'Procedimiento', estado: 'Validada' },
    { id: 46, titulo: 'Cadena de custodia #046', fecha: '05/05/2026', tipo: 'Cadena custodia', estado: 'Incompleta' },
    { id: 45, titulo: 'Acta de requisa #045', fecha: '04/05/2026', tipo: 'Requisa', estado: 'Validada' },
    { id: 44, titulo: 'Informe judicial #044', fecha: '03/05/2026', tipo: 'Informe', estado: 'Error' },
];

// ========================================
//   FUNCIONES PRINCIPALES
// ========================================

function switchTab(tab) {
    // Ocultar todos los paneles
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    // Mostrar el panel seleccionado
    const panel = document.getElementById('panel-' + tab);
    if (panel) panel.classList.add('active');
    
    // Actualizar navegación
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navItem = document.querySelector(`.nav-item[data-tab="${tab}"]`);
    if (navItem) navItem.classList.add('active');
    
    // Actualizar título
    const titles = {
        dashboard: 'Panel principal',
        nueva: 'Nueva acta',
        historial: 'Historial',
        estadisticas: 'Estadísticas',
        plantillas: 'Plantillas',
        personas: 'Personas',
        config: 'Configuración',
        reportes: 'Reportes'
    };
    document.getElementById('pageTitle').textContent = titles[tab] || tab;
}

function selectTipo(el) {
    document.querySelectorAll('.tipo-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
}

function guardarActa(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Acta guardada:', data);
    alert('✅ Acta guardada exitosamente');
    switchTab('dashboard');
}

// ========================================
//   RENDERIZADO
// ========================================

function renderActas() {
    const tbody = document.getElementById('actasTable');
    tbody.innerHTML = actasData.map(acta => `
        <tr>
            <td>
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:18px;">${getIconForTipo(acta.tipo)}</span>
                    <div>
                        <div style="font-weight:500;">${acta.titulo}</div>
                        <div style="font-size:11px;color:var(--text-secondary);">${acta.autor} · ${acta.jurisdiccion}</div>
                    </div>
                </div>
            </td>
            <td style="font-size:13px;">${acta.fecha}</td>
            <td>${getBadgeForEstado(acta.estado)}</td>
            <td>
                <button class="action-btn" onclick="verActa(${acta.id})"><i class="ri-eye-line"></i></button>
                <button class="action-btn" onclick="exportarActa(${acta.id})"><i class="ri-download-line"></i></button>
                <button class="action-btn" onclick="editarActa(${acta.id})"><i class="ri-edit-line"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderHistorial() {
    const tbody = document.getElementById('historialTable');
    tbody.innerHTML = historialData.map(item => `
        <tr>
            <td><strong>${item.titulo}</strong></td>
            <td>${item.fecha}</td>
            <td>${item.tipo}</td>
            <td>${getBadgeForEstado(item.estado)}</td>
            <td>
                <button class="action-btn"><i class="ri-eye-line"></i></button>
                <button class="action-btn"><i class="ri-download-line"></i></button>
                <button class="action-btn"><i class="ri-edit-line"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderAlerts() {
    const container = document.getElementById('alertsContainer');
    container.innerHTML = alertsData.map(alert => `
        <div class="alert-item">
            <div class="alert-icon">${getAlertIcon(alert.tipo)}</div>
            <div class="alert-content">
                <div class="title">${alert.mensaje}</div>
            </div>
        </div>
    `).join('');
}

function renderMonthlyChart() {
    const container = document.getElementById('monthlyChart');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May'];
    const values = [40, 55, 45, 65, 50];
    const max = Math.max(...values);
    
    container.innerHTML = months.map((month, i) => {
        const height = (values[i] / max) * 120 + 20;
        return `
            <div class="bar-item">
                <div class="bar" style="height:${height}px; background: ${i === 4 ? 'var(--primary-light)' : 'var(--primary)'};"></div>
                <div class="label">${month}</div>
            </div>
        `;
    }).join('');
}

function renderDetailedChart() {
    const container = document.getElementById('detailedChart');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May'];
    const values = [32, 45, 38, 52, 46];
    const max = Math.max(...values);
    
    container.innerHTML = months.map((month, i) => {
        const height = (values[i] / max) * 120 + 20;
        return `
            <div class="bar-item">
                <div class="bar" style="height:${height}px; background: ${i === 4 ? 'var(--primary-light)' : 'var(--primary)'};"></div>
                <div class="label">${month}</div>
                <div style="font-size:10px;color:var(--text-secondary);">${values[i]}</div>
            </div>
        `;
    }).join('');
}

// ========================================
//   UTILIDADES
// ========================================

function getIconForTipo(tipo) {
    const icons = {
        procedimiento: '📄',
        constatacion: '🔍',
        requisa: '👤',
        allanamiento: '🏠',
        secuestro: '🔒',
        custodia: '🔗'
    };
    return icons[tipo] || '📄';
}

function getBadgeForEstado(estado) {
    const badges = {
        'Validada': '<span class="badge badge-success">✅ Validada</span>',
        'Incompleta': '<span class="badge badge-warning">⚠️ Incompleta</span>',
        'Error': '<span class="badge badge-danger">❌ Error</span>',
        'En proceso': '<span class="badge badge-info">🔄 En proceso</span>',
        'Pendiente': '<span class="badge badge-warning">⏳ Pendiente</span>'
    };
    return badges[estado] || `<span class="badge badge-info">${estado}</span>`;
}

function getAlertIcon(tipo) {
    const icons = {
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        success: '✅'
    };
    return icons[tipo] || 'ℹ️';
}

// ========================================
//   ACCIONES
// ========================================

function verActa(id) {
    alert(`🔍 Ver acta #${id}`);
}

function exportarActa(id) {
    alert(`📥 Exportando acta #${id}...`);
}

function editarActa(id) {
    alert(`✏️ Editar acta #${id}`);
}

// ========================================
//   TEMA OSCURO/CLARO
// ========================================

let darkMode = false;

function toggleTheme() {
    darkMode = !darkMode;
    const html = document.documentElement;
    const icon = document.getElementById('themeIcon');
    
    if (darkMode) {
        html.setAttribute('data-theme', 'dark');
        icon.className = 'ri-moon-line';
        const select = document.getElementById('themeSelect');
        if (select) select.value = 'dark';
    } else {
        html.removeAttribute('data-theme');
        icon.className = 'ri-sun-line';
        const select = document.getElementById('themeSelect');
        if (select) select.value = 'light';
    }
}

function setTheme(value) {
    const html = document.documentElement;
    const icon = document.getElementById('themeIcon');
    
    if (value === 'dark') {
        darkMode = true;
        html.setAttribute('data-theme', 'dark');
        icon.className = 'ri-moon-line';
    } else if (value === 'light') {
        darkMode = false;
        html.removeAttribute('data-theme');
        icon.className = 'ri-sun-line';
    } else {
        // Sistema - detectar preferencia del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            darkMode = true;
            html.setAttribute('data-theme', 'dark');
            icon.className = 'ri-moon-line';
        } else {
            darkMode = false;
            html.removeAttribute('data-theme');
            icon.className = 'ri-sun-line';
        }
    }
}

// ========================================
//   SIDEBAR RESPONSIVE
// ========================================

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// ========================================
//   MODAL
// ========================================

function openModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalContent').innerHTML = content;
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

// ========================================
//   INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Configurar eventos de navegación
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const tab = this.dataset.tab;
            if (tab) switchTab(tab);
        });
    });

    // Configurar selección de tipo
    document.querySelectorAll('.tipo-card').forEach(card => {
        card.addEventListener('click', function() {
            selectTipo(this);
        });
    });

    // Configurar tema desde selector
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            setTheme(this.value);
        });
    }

    // Cerrar modal con click fuera
    document.getElementById('modalOverlay').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // Renderizar datos
    renderActas();
    renderHistorial();
    renderAlerts();
    renderMonthlyChart();
    renderDetailedChart();

    // Mostrar sidebar en móvil
    const menuBtn = document.getElementById('menuBtn');
    if (window.innerWidth <= 992) {
        menuBtn.style.display = 'flex';
    }

    // Cerrar sidebar en móvil al hacer click en un item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                document.getElementById('sidebar').classList.remove('active');
            }
        });
    });
});

// ========================================
//   PERSISTENCIA CON LOCALSTORAGE
// ========================================

// Guardar actas en localStorage
function guardarActasLocal(actas) {
    localStorage.setItem('actas_sirp', JSON.stringify(actas));
}

// Cargar actas desde localStorage
function cargarActasLocal() {
    const data = localStorage.getItem('actas_sirp');
    return data ? JSON.parse(data) : [];
}

// Guardar una nueva acta
function guardarActaLocal(acta) {
    const actas = cargarActasLocal();
    const nuevaActa = {
        ...acta,
        id: Date.now(),
        fechaCreacion: new Date().toISOString(),
        estado: 'Pendiente'
    };
    actas.push(nuevaActa);
    guardarActasLocal(actas);
    return nuevaActa;
}

// Eliminar acta
function eliminarActaLocal(id) {
    let actas = cargarActasLocal();
    actas = actas.filter(a => a.id !== id);
    guardarActasLocal(actas);
}

// Actualizar acta
function actualizarActaLocal(id, datosActualizados) {
    const actas = cargarActasLocal();
    const index = actas.findIndex(a => a.id === id);
    if (index !== -1) {
        actas[index] = { ...actas[index], ...datosActualizados };
        guardarActasLocal(actas);
        return actas[index];
    }
    return null;
}

// Modificar el guardarActa existente
function guardarActa(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Obtener el tipo seleccionado
    const tipoSeleccionado = document.querySelector('.tipo-card.selected');
    const tipo = tipoSeleccionado ? tipoSeleccionado.dataset.tipo : 'procedimiento';
    
    const nuevaActa = {
        titulo: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} - ${data.lugar || 'Sin lugar'}`,
        tipo: tipo,
        fecha: data.fecha || new Date().toISOString().split('T')[0],
        hora: data.hora || '00:00',
        lugar: data.lugar || '',
        fuerza: data.fuerza || '',
        preventores: data.preventores || '',
        jurisdiccion: data.jurisdiccion || '',
        estado: 'Pendiente'
    };
    
    guardarActaLocal(nuevaActa);
    alert('✅ Acta guardada exitosamente');
    form.reset();
    renderActasLocal();
    switchTab('dashboard');
}

// Renderizar actas desde localStorage
function renderActasLocal() {
    const actas = cargarActasLocal();
    const tbody = document.getElementById('actasTable');
    
    if (actas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; padding:30px; color:var(--text-secondary);">
                    No hay actas registradas. ¡Crea tu primera acta!
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = actas.slice(-5).reverse().map(acta => `
        <tr>
            <td>
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:18px;">${getIconForTipo(acta.tipo)}</span>
                    <div>
                        <div style="font-weight:500;">${acta.titulo}</div>
                        <div style="font-size:11px;color:var(--text-secondary);">
                            ${acta.preventores || 'Sin asignar'} · ${acta.jurisdiccion || 'Sin jurisdicción'}
                        </div>
                    </div>
                </div>
            </td>
            <td style="font-size:13px;">${acta.fecha || 'Sin fecha'}</td>
            <td>${getBadgeForEstado(acta.estado)}</td>
            <td>
                <button class="action-btn" onclick="verActaLocal(${acta.id})"><i class="ri-eye-line"></i></button>
                <button class="action-btn" onclick="editarActaLocal(${acta.id})"><i class="ri-edit-line"></i></button>
                <button class="action-btn" onclick="eliminarActaLocalConfirm(${acta.id})" style="color:var(--danger);"><i class="ri-delete-bin-line"></i></button>
            </td>
        </tr>
    `).join('');
}

// Ver acta
function verActaLocal(id) {
    const actas = cargarActasLocal();
    const acta = actas.find(a => a.id === id);
    if (acta) {
        openModal('📄 Detalle del acta', `
            <div style="display:grid;gap:12px;">
                <div><strong>Título:</strong> ${acta.titulo}</div>
                <div><strong>Tipo:</strong> ${acta.tipo}</div>
                <div><strong>Fecha:</strong> ${acta.fecha || 'No especificada'}</div>
                <div><strong>Hora:</strong> ${acta.hora || 'No especificada'}</div>
                <div><strong>Lugar:</strong> ${acta.lugar || 'No especificado'}</div>
                <div><strong>Fuerza:</strong> ${acta.fuerza || 'No especificada'}</div>
                <div><strong>Preventores:</strong> ${acta.preventores || 'No especificados'}</div>
                <div><strong>Jurisdicción:</strong> ${acta.jurisdiccion || 'No especificada'}</div>
                <div><strong>Estado:</strong> ${acta.estado}</div>
                <div style="font-size:11px;color:var(--text-secondary);">
                    Creado: ${new Date(acta.fechaCreacion).toLocaleString()}
                </div>
            </div>
        `);
    }
}

// Editar acta
function editarActaLocal(id) {
    const actas = cargarActasLocal();
    const acta = actas.find(a => a.id === id);
    if (acta) {
        openModal('✏️ Editar acta', `
            <form onsubmit="actualizarActaLocal(event, ${id})">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Título</label>
                        <input type="text" name="titulo" value="${acta.titulo}" required>
                    </div>
                    <div class="form-group">
                        <label>Tipo</label>
                        <select name="tipo">
                            <option value="procedimiento" ${acta.tipo === 'procedimiento' ? 'selected' : ''}>Procedimiento</option>
                            <option value="constatacion" ${acta.tipo === 'constatacion' ? 'selected' : ''}>Constatación</option>
                            <option value="requisa" ${acta.tipo === 'requisa' ? 'selected' : ''}>Requisa</option>
                            <option value="allanamiento" ${acta.tipo === 'allanamiento' ? 'selected' : ''}>Allanamiento</option>
                            <option value="secuestro" ${acta.tipo === 'secuestro' ? 'selected' : ''}>Secuestro</option>
                            <option value="custodia" ${acta.tipo === 'custodia' ? 'selected' : ''}>Cadena de custodia</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Fecha</label>
                        <input type="date" name="fecha" value="${acta.fecha}" required>
                    </div>
                    <div class="form-group">
                        <label>Estado</label>
                        <select name="estado">
                            <option value="Pendiente" ${acta.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="En proceso" ${acta.estado === 'En proceso' ? 'selected' : ''}>En proceso</option>
                            <option value="Validada" ${acta.estado === 'Validada' ? 'selected' : ''}>Validada</option>
                            <option value="Incompleta" ${acta.estado === 'Incompleta' ? 'selected' : ''}>Incompleta</option>
                            <option value="Error" ${acta.estado === 'Error' ? 'selected' : ''}>Error</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Lugar</label>
                        <input type="text" name="lugar" value="${acta.lugar || ''}">
                    </div>
                    <div class="form-group">
                        <label>Fuerza</label>
                        <input type="text" name="fuerza" value="${acta.fuerza || ''}">
                    </div>
                    <div class="form-group">
                        <label>Preventores</label>
                        <input type="text" name="preventores" value="${acta.preventores || ''}">
                    </div>
                    <div class="form-group">
                        <label>Jurisdicción</label>
                        <input type="text" name="jurisdiccion" value="${acta.jurisdiccion || ''}">
                    </div>
                </div>
                <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:20px;">
                    <button type="button" class="btn" onclick="closeModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar cambios</button>
                </div>
            </form>
        `);
    }
}

// Actualizar acta
function actualizarActaLocal(e, id) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    actualizarActaLocal(id, data);
    closeModal();
    renderActasLocal();
    alert('✅ Acta actualizada exitosamente');
}

// Eliminar acta con confirmación
function eliminarActaLocalConfirm(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta acta?')) {
        eliminarActaLocal(id);
        renderActasLocal();
        alert('🗑️ Acta eliminada');
    }
}

// ========================================
//   FUNCIONES DE BUSQUEDA
// ========================================

function buscarActas(query) {
    const actas = cargarActasLocal();
    const resultados = actas.filter(acta => 
        acta.titulo.toLowerCase().includes(query.toLowerCase()) ||
        acta.lugar?.toLowerCase().includes(query.toLowerCase()) ||
        acta.preventores?.toLowerCase().includes(query.toLowerCase()) ||
        acta.jurisdiccion?.toLowerCase().includes(query.toLowerCase())
    );
    return resultados;
}

// ========================================
//   ACTUALIZAR INICIALIZACIÓN
// ========================================

// Reemplazar la función de inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Configurar eventos de navegación
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const tab = this.dataset.tab;
            if (tab) switchTab(tab);
        });
    });

    // Configurar selección de tipo
    document.querySelectorAll('.tipo-card').forEach(card => {
        card.addEventListener('click', function() {
            selectTipo(this);
        });
    });

    // Configurar tema desde selector
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            setTheme(this.value);
        });
    }

    // Cerrar modal con click fuera
    document.getElementById('modalOverlay').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // Configurar búsqueda
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.addEventListener('click', function() {
            const query = prompt('🔍 Buscar actas:', '');
            if (query) {
                const resultados = buscarActas(query);
                if (resultados.length > 0) {
                    alert(`🔍 ${resultados.length} resultado(s) encontrado(s)`);
                } else {
                    alert('❌ No se encontraron resultados');
                }
            }
        });
    }

    // Renderizar datos desde localStorage
    renderActasLocal();
    renderHistorialLocal();
    renderAlerts();
    renderMonthlyChart();
    renderDetailedChart();

    // Mostrar sidebar en móvil
    const menuBtn = document.getElementById('menuBtn');
    if (window.innerWidth <= 992) {
        menuBtn.style.display = 'flex';
    }

    // Cerrar sidebar en móvil al hacer click en un item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                document.getElementById('sidebar').classList.remove('active');
            }
        });
    });
});

// Renderizar historial desde localStorage
function renderHistorialLocal() {
    const actas = cargarActasLocal();
    const tbody = document.getElementById('historialTable');
    
    if (actas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; padding:30px; color:var(--text-secondary);">
                    No hay actas en el historial
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = actas.slice().reverse().map(acta => `
        <tr>
            <td><strong>${acta.titulo}</strong></td>
            <td>${acta.fecha || 'Sin fecha'}</td>
            <td>${acta.tipo || 'Sin tipo'}</td>
            <td>${getBadgeForEstado(acta.estado)}</td>
            <td>
                <button class="action-btn" onclick="verActaLocal(${acta.id})"><i class="ri-eye-line"></i></button>
                <button class="action-btn" onclick="exportarActaPDF(${acta.id})"><i class="ri-download-line"></i></button>
                <button class="action-btn" onclick="editarActaLocal(${acta.id})"><i class="ri-edit-line"></i></button>
            </td>
        </tr>
    `).join('');
}

// Responsive: mostrar/ocultar botón de menú
window.addEventListener('resize', function() {
    const menuBtn = document.getElementById('menuBtn');
    if (window.innerWidth <= 992) {
        menuBtn.style.display = 'flex';
    } else {
        menuBtn.style.display = 'none';
        document.getElementById('sidebar').classList.remove('active');
    }
});

// ========================================
//   EXPORTAR A PDF
// ========================================

function exportarActaPDF(id) {
    const actas = cargarActasLocal();
    const acta = actas.find(a => a.id === id);
    if (!acta) {
        alert('❌ Acta no encontrada');
        return;
    }

    // Crear contenido para PDF
    const contenido = `
        <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
            <div style="text-align: center; border-bottom: 2px solid #1a472a; padding-bottom: 20px; margin-bottom: 20px;">
                <h1 style="color: #1a472a; margin: 0;">SIRP - Sistema de Redacción Procesal</h1>
                <p style="color: #666; margin: 5px 0 0;">Acta de procedimiento</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h2 style="color: #1a472a; border-left: 4px solid #1a472a; padding-left: 12px;">${acta.titulo}</h2>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <div><strong>Tipo:</strong> ${acta.tipo}</div>
                <div><strong>Estado:</strong> ${acta.estado}</div>
                <div><strong>Fecha:</strong> ${acta.fecha || 'No especificada'}</div>
                <div><strong>Hora:</strong> ${acta.hora || 'No especificada'}</div>
                <div><strong>Lugar:</strong> ${acta.lugar || 'No especificado'}</div>
                <div><strong>Fuerza:</strong> ${acta.fuerza || 'No especificada'}</div>
                <div><strong>Preventores:</strong> ${acta.preventores || 'No especificados'}</div>
                <div><strong>Jurisdicción:</strong> ${acta.jurisdiccion || 'No especificada'}</div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
                <p>Documento generado por SIRP v1.0</p>
                <p>Fecha de exportación: ${new Date().toLocaleString()}</p>
            </div>
        </div>
    `;

    // Crear un contenedor temporal
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = contenido;
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    document.body.appendChild(tempDiv);

    // Generar PDF
    html2pdf()
        .from(tempDiv)
        .set({
            margin: [10, 10],
            filename: `Acta_${acta.id}_${new Date().toISOString().split('T')[0]}.pdf`,
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            }
        })
        .save()
        .then(() => {
            document.body.removeChild(tempDiv);
            alert('✅ PDF exportado exitosamente');
        })
        .catch((error) => {
            console.error('Error al exportar PDF:', error);
            document.body.removeChild(tempDiv);
            alert('❌ Error al exportar PDF');
        });
}

// ========================================
//   GRÁFICOS CON CHART.JS
// ========================================

let chartInstance = null;
let chartInstance2 = null;

function renderCharts() {
    const actas = cargarActasLocal();
    
    // Datos por mes
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const mesActual = new Date().getMonth();
    const mesesMostrar = meses.slice(0, mesActual + 1);
    const datosPorMes = mesesMostrar.map((_, index) => {
        return actas.filter(a => {
            if (!a.fecha) return false;
            const fecha = new Date(a.fecha);
            return fecha.getMonth() === index && fecha.getFullYear() === new Date().getFullYear();
        }).length;
    });

    // Destruir gráficos anteriores si existen
    if (chartInstance) {
        chartInstance.destroy();
    }
    if (chartInstance2) {
        chartInstance2.destroy();
    }

    // Gráfico de barras
    const ctx = document.createElement('canvas');
    document.getElementById('monthlyChart').innerHTML = '';
    document.getElementById('monthlyChart').appendChild(ctx);
    
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: mesesMostrar,
            datasets: [{
                label: 'Actas por mes',
                data: datosPorMes,
                backgroundColor: '#1a472a',
                borderColor: '#2d6b44',
                borderWidth: 2,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    // Gráfico de donut para el panel de estadísticas
    const ctx2 = document.createElement('canvas');
    const donutContainer = document.querySelector('.charts-grid .chart-card:last-child .donut-container');
    if (donutContainer) {
        donutContainer.innerHTML = '';
        donutContainer.style.display = 'flex';
        donutContainer.style.justifyContent = 'center';
        donutContainer.style.alignItems = 'center';
        const canvasWrapper = document.createElement('div');
        canvasWrapper.style.width = '200px';
        canvasWrapper.style.height = '200px';
        canvasWrapper.appendChild(ctx2);
        donutContainer.appendChild(canvasWrapper);
    }

    const estados = ['Validada', 'En proceso', 'Pendiente', 'Incompleta', 'Error'];
    const colores = ['#27ae60', '#f39c12', '#e74c3c', '#3498db', '#e74c3c'];
    const datosEstados = estados.map(e => actas.filter(a => a.estado === e).length);

    chartInstance2 = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: estados,
            datasets: [{
                data: datosEstados,
                backgroundColor: colores,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Actualizar renderizado de gráficos
function renderMonthlyChart() {
    renderCharts();
}

function renderDetailedChart() {
    // Ya se renderiza con renderCharts()
}

// ========================================
//   CONEXIÓN CON API
// ========================================

const API_URL = 'http://localhost:3000/actas';

// Obtener actas desde API
async function obtenerActasAPI() {
    try {
        const response = await fetch(API_URL);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener actas:', error);
        return [];
    }
}

// Guardar acta en API
async function guardarActaAPI(acta) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(acta)
        });
        return await response.json();
    } catch (error) {
        console.error('Error al guardar acta:', error);
        return null;
    }
}

// Actualizar acta en API
async function actualizarActaAPI(id, datos) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        return await response.json();
    } catch (error) {
        console.error('Error al actualizar acta:', error);
        return null;
    }
}

// Eliminar acta en API
async function eliminarActaAPI(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        return true;
    } catch (error) {
        console.error('Error al eliminar acta:', error);
        return false;
    }
}