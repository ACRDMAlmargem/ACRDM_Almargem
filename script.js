// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Limpar relatórios ocultos e uploads antigos ao reiniciar com nova lista de documentos
    const knownFiles = STATIC_REPORTS.map(r => r.file);
    const hidden = JSON.parse(localStorage.getItem('hiddenReports') || '[]');
    const validHidden = hidden.filter(f => knownFiles.includes(f));
    localStorage.setItem('hiddenReports', JSON.stringify(validHidden));

    const knownReunioes = STATIC_REUNIOES.map(r => r.file);
    const hiddenR = JSON.parse(localStorage.getItem('hiddenReunioes') || '[]');
    localStorage.setItem('hiddenReunioes', JSON.stringify(hiddenR.filter(f => knownReunioes.includes(f))));

    initializeTabs();
    initializeReports();
    initializeReunioes();
    initializePublicacoes();
    initializeSocios();
    initializeReservas();
    initializeAdesaoForm();
    initializeAdministration();
    checkAdminStatus();
});

// Sistema de abas
function initializeTabs() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Garantir que o tab activo no nav tem o conteúdo visível (fix para carregamento via link externo)
    const activeNav = document.querySelector('.nav-item.active');
    if (activeNav) {
        const targetTab = activeNav.getAttribute('data-tab');
        tabContents.forEach(content => content.classList.remove('active'));
        const targetContent = document.getElementById(targetTab);
        if (targetContent) targetContent.classList.add('active');
    }
}

// Inicialização de dados
function initializeData() {
    // Inicializar relatórios
    initializeReports();
    
    // Inicializar publicações
    initializePublicacoes();
    
    // Inicializar sócios
    initializeSocios();
    
    // Inicializar reservas
    initializeReservas();
}

// Carregar dados armazenados
function loadStoredData() {
    const reports = localStorage.getItem('reports');
    const publicacoes = localStorage.getItem('publicacoes');
    const socios = localStorage.getItem('socios');
    const reservas = localStorage.getItem('reservas');

    if (reports) {
        displayReports(JSON.parse(reports));
    }
    if (publicacoes) {
        displayPublicacoes(JSON.parse(publicacoes));
    }
    if (socios) {
        displaySocios(JSON.parse(socios));
    }
    if (reservas) {
        displayReservas(JSON.parse(reservas));
    }
}

// Sistema de Relatórios
const GH_OWNER = 'ACRDMAlmargem';
const GH_REPO  = 'ACRDM_Almargem';

const STATIC_REUNIOES = [
    {
        titulo: 'Convocatória - Reunião de Direção n.º 1/2026',
        data:   '11/06/2026',
        periodo:'20 de Junho de 2026',
        tag:    'Convocatória',
        file:   'Convocatoria_Reuniao_20062026.pdf'
    }
];

const STATIC_REPORTS = [
    {
        titulo: 'Balancete (Provisório) - 2.º Trimestre 2026',
        data:   '12/06/2026',
        periodo:'2.º Trimestre 2026 (Abr – Jun)',
        tag:    'Provisório',
        file:   'Balancete_2Tri_2026_Provisorio.pdf'
    },
    {
        titulo: 'Balancete Retificativo - 1.º Trimestre 2026',
        data:   '12/06/2026',
        periodo:'1.º Trimestre 2026 (Jan – Mar)',
        tag:    'Retificativo',
        file:   'Balancete_Retificativo_1Tri_2026.pdf'
    },
    {
        titulo: 'Extrato Bancário - Março 2026',
        data:   '01/04/2026',
        periodo:'1.º Trimestre 2026 (Jan – Mar)',
        tag:    null,
        file:   'Extracto_Marco_2026.pdf'
    }
];

function initializeReports() {
    const reportsList = document.getElementById('reportsList');
    if (!reportsList) return;

    const hidden = JSON.parse(localStorage.getItem('hiddenReports') || '[]');
    const visible = STATIC_REPORTS.filter(r => !hidden.includes(r.file));

    if (visible.length === 0) {
        reportsList.innerHTML = '<p style="color:#606060;padding:1rem;">Sem relatórios disponíveis.</p>';
        return;
    }

    reportsList.innerHTML = visible.map(r => `
        <div class="report-card">
            <div class="report-info">
                <h4>${r.titulo}${r.tag ? ` <span class="report-tag">${r.tag}</span>` : ''}</h4>
                <p><strong>Período:</strong> ${r.periodo}</p>
                <p><strong>Data:</strong> ${r.data}</p>
            </div>
            <div class="report-actions">
                <button onclick="viewReport('./${r.file}')" class="btn btn-small">
                    <i class="fas fa-eye"></i> Visualizar
                </button>
                <button onclick="downloadReport('${r.file}')" class="btn btn-small btn-secondary">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        </div>
    `).join('');
}

function renderAdminDocs() {
    const list = document.getElementById('adminDocsList');
    if (!list) return;

    const hidden = JSON.parse(localStorage.getItem('hiddenReports') || '[]');

    if (STATIC_REPORTS.length === 0) {
        list.innerHTML = '<p style="color:#606060;font-size:0.85rem;">Nenhum documento configurado.</p>';
        return;
    }

    list.innerHTML = STATIC_REPORTS.map(r => {
        const isHidden = hidden.includes(r.file);
        return `
        <div class="pdf-item" style="${isHidden ? 'opacity:0.5;' : ''}">
            <div>
                <strong>${r.titulo}</strong>${isHidden ? ' <em style="color:#c0392b;font-size:0.8rem;">(eliminado)</em>' : ''}
                <br><small>${r.periodo} &nbsp;·&nbsp; ${r.data}</small>
            </div>
            <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
                <button onclick="viewReport('./${r.file}')" class="btn btn-small">
                    <i class="fas fa-eye"></i> Ver
                </button>
                ${isHidden
                    ? `<button onclick="restoreReport('${r.file}')" class="btn btn-small btn-secondary">
                           <i class="fas fa-undo"></i> Restaurar
                       </button>`
                    : `<button onclick="hideReport('${r.file}')" class="btn btn-small btn-danger">
                           <i class="fas fa-trash"></i> Eliminar
                       </button>`
                }
            </div>
        </div>`;
    }).join('');
}

function hideReport(file) {
    if (!confirm('Tem a certeza que pretende eliminar este documento do separador público?')) return;
    const hidden = JSON.parse(localStorage.getItem('hiddenReports') || '[]');
    if (!hidden.includes(file)) hidden.push(file);
    localStorage.setItem('hiddenReports', JSON.stringify(hidden));
    initializeReports();
    renderAdminDocs();
    showMessage('Documento eliminado do separador público.', 'success');
}

function restoreReport(file) {
    const hidden = JSON.parse(localStorage.getItem('hiddenReports') || '[]');
    const updated = hidden.filter(f => f !== file);
    localStorage.setItem('hiddenReports', JSON.stringify(updated));
    initializeReports();
    renderAdminDocs();
    showMessage('Documento restaurado no separador público.', 'success');
}

// ── GitHub API helpers ─────────────────────────────────────────────────────
async function ghGet(token, path) {
    const r = await fetch(
        `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}`,
        { headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' } }
    );
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`GitHub ${r.status}: ${(await r.json()).message}`);
    return r.json();
}

async function ghPut(token, path, contentB64, message, sha) {
    const body = { message, content: contentB64, branch: 'main' };
    if (sha) body.sha = sha;
    const r = await fetch(
        `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    );
    if (!r.ok) throw new Error(`GitHub ${r.status}: ${(await r.json()).message}`);
    return r.json();
}

async function uploadReuniao(pdfFile, meta) {
    const token = localStorage.getItem('githubToken');
    if (!token) {
        showMessage('Configure o Token GitHub nas definições de administrador.', 'error');
        return;
    }
    const btn = document.querySelector('#pdfUploadForm button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'A publicar...'; }
    try {
        const filename = pdfFile.name.replace(/\s+/g, '_').replace(/[^\w.-]/g, '');
        const pdfB64 = await new Promise((res, rej) => {
            const rd = new FileReader();
            rd.onload = e => res(e.target.result.split(',')[1]);
            rd.onerror = rej;
            rd.readAsDataURL(pdfFile);
        });
        const existingPdf = await ghGet(token, filename);
        await ghPut(token, filename, pdfB64, `docs: upload ${filename}`, existingPdf?.sha);

        const existingJson = await ghGet(token, 'reunioes.json');
        let reunioes = existingJson
            ? JSON.parse(atob(existingJson.content.replace(/[\r\n]/g, '')))
            : [];
        reunioes = reunioes.filter(r => r.file !== filename);
        reunioes.unshift({ titulo: meta.titulo, data: meta.data, periodo: meta.periodo, tag: meta.tag || null, file: filename });
        const jsonB64 = btoa(unescape(encodeURIComponent(JSON.stringify(reunioes, null, 2))));
        await ghPut(token, 'reunioes.json', jsonB64, `docs: reunioes.json add ${filename}`, existingJson?.sha);

        document.getElementById('pdfUploadForm').reset();
        toggleReuniaoFields();
        showMessage('Documento publicado! Visível para todos em ~30 segundos.', 'success');
        setTimeout(() => initializeReunioes(), 8000);
    } catch (e) {
        showMessage(`Erro: ${e.message}`, 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Upload PDF'; }
    }
}

function toggleReuniaoFields() {
    const tipo = document.getElementById('pdfTipo').value;
    const isR = tipo === 'reunioes_direcao';
    const rf = document.getElementById('reuniaoFields');
    const mf = document.getElementById('mesAnoFields');
    if (rf) rf.style.display = isR ? 'block' : 'none';
    if (mf) mf.style.display = isR ? 'none' : 'flex';
}

// ── Reuniões de Direção ────────────────────────────────────────────────────
async function initializeReunioes() {
    const list = document.getElementById('reunioesList');
    if (!list) return;
    let reunioes = STATIC_REUNIOES;
    try {
        const r = await fetch(`reunioes.json?cb=${Date.now()}`);
        if (r.ok) reunioes = await r.json();
    } catch (e) { /* fallback to STATIC_REUNIOES */ }
    const hidden = JSON.parse(localStorage.getItem('hiddenReunioes') || '[]');
    const visible = reunioes.filter(r => !hidden.includes(r.file));
    if (visible.length === 0) {
        list.innerHTML = '<p style="color:#606060;padding:1rem;">Sem documentos disponíveis.</p>';
        return;
    }
    list.innerHTML = visible.map(r => `
        <div class="report-card">
            <div class="report-info">
                <h4>${r.titulo}${r.tag ? ` <span class="report-tag">${r.tag}</span>` : ''}</h4>
                <p><strong>Data:</strong> ${r.periodo}</p>
                <p><strong>Publicado:</strong> ${r.data}</p>
            </div>
            <div class="report-actions">
                <button onclick="viewReport('./${r.file}')" class="btn btn-small">
                    <i class="fas fa-eye"></i> Visualizar
                </button>
                <button onclick="downloadReport('${r.file}')" class="btn btn-small btn-secondary">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        </div>
    `).join('');
}

function renderAdminReunioes() {
    const list = document.getElementById('adminReunioesList');
    if (!list) return;
    const hidden = JSON.parse(localStorage.getItem('hiddenReunioes') || '[]');
    if (STATIC_REUNIOES.length === 0) {
        list.innerHTML = '<p style="color:#606060;font-size:0.85rem;">Nenhum documento configurado.</p>';
        return;
    }
    list.innerHTML = STATIC_REUNIOES.map(r => {
        const isHidden = hidden.includes(r.file);
        return `
        <div class="pdf-item" style="${isHidden ? 'opacity:0.5;' : ''}">
            <div>
                <strong>${r.titulo}</strong>${isHidden ? ' <em style="color:#c0392b;font-size:0.8rem;">(eliminado)</em>' : ''}
                <br><small>${r.periodo} &nbsp;·&nbsp; ${r.data}</small>
            </div>
            <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
                <button onclick="viewReport('./${r.file}')" class="btn btn-small">
                    <i class="fas fa-eye"></i> Ver
                </button>
                ${isHidden
                    ? `<button onclick="restoreReuniao('${r.file}')" class="btn btn-small btn-secondary">
                           <i class="fas fa-undo"></i> Restaurar
                       </button>`
                    : `<button onclick="hideReuniao('${r.file}')" class="btn btn-small btn-danger">
                           <i class="fas fa-trash"></i> Eliminar
                       </button>`
                }
            </div>
        </div>`;
    }).join('');
}

function hideReuniao(file) {
    if (!confirm('Tem a certeza que pretende eliminar este documento do separador público?')) return;
    const hidden = JSON.parse(localStorage.getItem('hiddenReunioes') || '[]');
    if (!hidden.includes(file)) hidden.push(file);
    localStorage.setItem('hiddenReunioes', JSON.stringify(hidden));
    initializeReunioes();
    renderAdminReunioes();
    showMessage('Documento eliminado do separador público.', 'success');
}

function restoreReuniao(file) {
    const hidden = JSON.parse(localStorage.getItem('hiddenReunioes') || '[]');
    localStorage.setItem('hiddenReunioes', JSON.stringify(hidden.filter(f => f !== file)));
    initializeReunioes();
    renderAdminReunioes();
    showMessage('Documento restaurado no separador público.', 'success');
}

function populateMonthSelect() {
    const monthSelect = document.getElementById('monthSelect');
    const reports = JSON.parse(localStorage.getItem('reports') || '[]');
    
    // Limpar opções existentes
    monthSelect.innerHTML = '<option value="">Selecione um mês</option>';
    
    // Obter meses únicos dos relatórios existentes
    const uniqueMonths = new Set();
    reports.forEach(report => {
        if (report.month) {
            uniqueMonths.add(report.month);
        }
    });
    
    // Converter para array e ordenar
    const sortedMonths = Array.from(uniqueMonths).sort((a, b) => new Date(a) - new Date(b));
    
    // Adicionar opções ao select
    sortedMonths.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        
        // Formatar nome do mês
        const [year, monthNum] = month.split('-');
        const date = new Date(year, monthNum - 1);
        const monthName = date.toLocaleString('pt-PT', { month: 'long' });
        option.textContent = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
        
        monthSelect.appendChild(option);
    });
    
    // Se não houver relatórios, mostrar mensagem
    if (sortedMonths.length === 0) {
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "Nenhum relatório encontrado";
        option.disabled = true;
        monthSelect.appendChild(option);
    }
}

function openBalanceteModal() {
    document.getElementById('balanceteModal').style.display = 'block';
    // Set current month as default
    const currentMonth = new Date().toISOString().slice(0, 7);
    document.getElementById('balanceteMonth').value = currentMonth;
}

function openPDFModal() {
    document.getElementById('pdfModal').style.display = 'block';
    // Set current month as default
    const currentMonth = new Date().toISOString().slice(0, 7);
    document.getElementById('pdfMonth').value = currentMonth;
}

function calculateTotals() {
    const receitasInputs = document.querySelectorAll('.balancete-section:first-child .valor-input:not(#totalReceitas)');
    const despesasInputs = document.querySelectorAll('.balancete-section:nth-child(2) .valor-input:not(#totalDespesas)');
    
    let totalReceitas = 0;
    let totalDespesas = 0;
    
    receitasInputs.forEach(input => {
        totalReceitas += parseFloat(input.value) || 0;
    });
    
    despesasInputs.forEach(input => {
        totalDespesas += parseFloat(input.value) || 0;
    });
    
    document.getElementById('totalReceitas').value = totalReceitas.toFixed(2);
    document.getElementById('totalDespesas').value = totalDespesas.toFixed(2);
    document.getElementById('saldoMes').value = (totalReceitas - totalDespesas).toFixed(2);
}

function saveBalancete() {
    const month = document.getElementById('balanceteMonth').value;
    const observacoes = document.getElementById('balanceteObservacoes').value;
    
    // Get all values
    const receitasInputs = document.querySelectorAll('.balancete-section:first-child .valor-input:not(#totalReceitas)');
    const despesasInputs = document.querySelectorAll('.balancete-section:nth-child(2) .valor-input:not(#totalDespesas)');
    
    const receitasData = {};
    const despesasData = {};
    
    receitasInputs.forEach((input, index) => {
        const label = input.previousElementSibling.textContent.replace(':', '');
        receitasData[label] = parseFloat(input.value) || 0;
    });
    
    despesasInputs.forEach((input, index) => {
        const label = input.previousElementSibling.textContent.replace(':', '');
        despesasData[label] = parseFloat(input.value) || 0;
    });
    
    const totalReceitas = parseFloat(document.getElementById('totalReceitas').value) || 0;
    const totalDespesas = parseFloat(document.getElementById('totalDespesas').value) || 0;
    const saldo = totalReceitas - totalDespesas;
    
    const balancete = {
        id: Date.now(),
        type: 'balancete',
        month: month,
        receitas: receitasData,
        despesas: despesasData,
        totalReceitas: totalReceitas,
        totalDespesas: totalDespesas,
        saldo: saldo,
        observacoes: observacoes,
        date: new Date().toISOString()
    };
    
    const reports = JSON.parse(localStorage.getItem('reports') || '[]');
    reports.push(balancete);
    localStorage.setItem('reports', JSON.stringify(reports));
    
    // Atualizar o select de meses após adicionar novo relatório
    populateMonthSelect();
    
    displayReports(reports);
    document.getElementById('balanceteModal').style.display = 'none';
    document.getElementById('balanceteForm').reset();
    showMessage('Balancete salvo com sucesso!', 'success');
}

function importPDF() {
    const pdfFile = document.getElementById('pdfFile').files[0];
    const month = document.getElementById('pdfMonth').value;
    
    if (!pdfFile) {
        showMessage('Por favor, selecione um ficheiro PDF', 'error');
        return;
    }
    
    // Read PDF as base64 for storage
    const reader = new FileReader();
    reader.onload = function(e) {
        const pdfReport = {
            id: Date.now(),
            type: 'pdf',
            month: month,
            fileName: pdfFile.name,
            fileSize: pdfFile.size,
            data: e.target.result,
            date: new Date().toISOString()
        };
        
        const reports = JSON.parse(localStorage.getItem('reports') || '[]');
        reports.push(pdfReport);
        localStorage.setItem('reports', JSON.stringify(reports));
        
        // Atualizar o select de meses após adicionar novo PDF
        populateMonthSelect();
        
        displayReports(reports);
        document.getElementById('pdfModal').style.display = 'none';
        document.getElementById('pdfForm').reset();
        showMessage('PDF importado com sucesso!', 'success');
    };
    
    reader.readAsDataURL(pdfFile);
}

function filterReports(selectedMonth) {
    const reports = JSON.parse(localStorage.getItem('reports') || '[]');
    const filtered = reports.filter(report => report.month === selectedMonth);
    displayReports(filtered);
}

function displayReports(reports) {
    const reportsList = document.getElementById('reportsList');
    reportsList.innerHTML = '';

    reports.sort((a, b) => new Date(b.date) - new Date(a.date));

    reports.forEach(report => {
        if (report.type === 'balancete') {
            displayBalancete(report, reportsList);
        } else if (report.type === 'pdf') {
            displayPDFReport(report, reportsList);
        } else {
            displaySimpleReport(report, reportsList);
        }
    });
}

function displayBalancete(balancete, container) {
    const balanceteItem = document.createElement('div');
    balanceteItem.className = 'balancete-item';
    
    let receitasRows = '';
    let despesasRows = '';
    
    for (const [key, value] of Object.entries(balancete.receitas)) {
        if (value > 0) {
            receitasRows += `
                <tr>
                    <td>${key}</td>
                    <td>€${value.toFixed(2)}</td>
                </tr>
            `;
        }
    }
    
    for (const [key, value] of Object.entries(balancete.despesas)) {
        if (value > 0) {
            despesasRows += `
                <tr>
                    <td>${key}</td>
                    <td>€${value.toFixed(2)}</td>
                </tr>
            `;
        }
    }
    
    balanceteItem.innerHTML = `
        <div class="balancete-header">
            <h4>Balancete - ${formatMonth(balancete.month)}</h4>
            <span class="badge">Estruturado</span>
        </div>
        <div class="balancete-content">
            <table class="balancete-table">
                <thead>
                    <tr>
                        <th colspan="2">Receitas</th>
                    </tr>
                </thead>
                <tbody>
                    ${receitasRows}
                    <tr class="total-row">
                        <td><strong>Total Receitas</strong></td>
                        <td><strong>€${balancete.totalReceitas.toFixed(2)}</strong></td>
                    </tr>
                </tbody>
            </table>
            
            <table class="balancete-table">
                <thead>
                    <tr>
                        <th colspan="2">Despesas</th>
                    </tr>
                </thead>
                <tbody>
                    ${despesasRows}
                    <tr class="total-row">
                        <td><strong>Total Despesas</strong></td>
                        <td><strong>€${balancete.totalDespesas.toFixed(2)}</strong></td>
                    </tr>
                </tbody>
            </table>
            
            <table class="balancete-table">
                <tr class="saldo-row">
                    <td><strong>Saldo do Mês</strong></td>
                    <td><strong>€${balancete.saldo.toFixed(2)}</strong></td>
                </tr>
            </table>
            
            ${balancete.observacoes ? `<p><strong>Observações:</strong> ${balancete.observacoes}</p>` : ''}
            <small>Criado em ${new Date(balancete.date).toLocaleDateString('pt-PT')}</small>
        </div>
    `;
    
    container.appendChild(balanceteItem);
}

function displayPDFReport(report, container) {
    const reportDiv = document.createElement('div');
    reportDiv.className = 'report-item';
    reportDiv.innerHTML = `
        <h3>${formatMonth(report.month)}</h3>
        <p><strong>Tipo:</strong> ${report.type === 'balancete' ? 'Balancete' : 'PDF Importado'}</p>
        <p><strong>Data:</strong> ${new Date(report.date).toLocaleDateString('pt-PT')}</p>
        <div class="report-actions">
            ${report.type === 'balancete' ? 
                `<button class="btn btn-sm" onclick="viewBalancete('${report.month}')">Ver Detalhes</button>` :
                `<button class="btn btn-sm" onclick="viewPDF('${report.month}')">Ver PDF</button>
                 <button class="btn btn-sm btn-secondary" onclick="downloadPDF('${report.month}')">Download</button>`
            }
            <button class="btn btn-sm btn-danger" onclick="deleteReport('${report.month}')">Eliminar</button>
        </div>
    `;
    container.appendChild(reportDiv);
}

function displaySimpleReport(report, container) {
    const reportItem = document.createElement('div');
    reportItem.className = 'report-item';
    reportItem.innerHTML = `
        <h4>Relatório - ${formatMonth(report.month)}</h4>
        <p><strong>Receitas:</strong> €${report.revenue.toFixed(2)}</p>
        <p><strong>Despesas:</strong> €${report.expenses.toFixed(2)}</p>
        <p><strong>Saldo:</strong> €${report.balance.toFixed(2)}</p>
        <p>${report.description}</p>
        <small>Data: ${new Date(report.date).toLocaleDateString('pt-PT')}</small>
    `;
    container.appendChild(reportItem);
}

function viewPDF(reportId) {
    const reports = JSON.parse(localStorage.getItem('reports') || '[]');
    const report = reports.find(r => r.id == reportId || r.month == reportId);
    
    if (report && report.type === 'pdf') {
        try {
            // Criar um blob a partir do data URL
            const base64Data = report.data.split(',')[1]; // Remover o prefixo "data:application/pdf;base64,"
            const binaryData = atob(base64Data);
            const bytes = new Uint8Array(binaryData.length);
            
            for (let i = 0; i < binaryData.length; i++) {
                bytes[i] = binaryData.charCodeAt(i);
            }
        
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(blob);
        
        // Abrir em nova janela
        const newWindow = window.open(pdfUrl, '_blank');
        
        // Limpar o URL object após a janela abrir
        setTimeout(() => {
            URL.revokeObjectURL(pdfUrl);
        }, 1000);
        } catch (error) {
            console.error('Erro ao abrir PDF:', error);
            showMessage('Erro ao abrir PDF. Tente fazer download.', 'error');
        }
    } else {
        showMessage('PDF não encontrado', 'error');
    }
}

function downloadPDF(reportId) {
    const reports = JSON.parse(localStorage.getItem('reports') || '[]');
    const report = reports.find(r => r.id == reportId || r.month == reportId);
    
    if (report && report.type === 'pdf') {
        try {
            // Criar um blob para download
            const base64Data = report.data.split(',')[1];
            const binaryData = atob(base64Data);
            const bytes = new Uint8Array(binaryData.length);
            
            for (let i = 0; i < binaryData.length; i++) {
                bytes[i] = binaryData.charCodeAt(i);
            }
            
            const blob = new Blob([bytes], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = report.fileName;
            link.click();
            
            // Limpar o URL object
            setTimeout(() => {
                URL.revokeObjectURL(pdfUrl);
            }, 1000);
            
            showMessage('Download iniciado', 'success');
        } catch (error) {
            console.error('Erro ao fazer download do PDF:', error);
            showMessage('Erro ao fazer download do PDF', 'error');
        }
    } else {
        showMessage('PDF não encontrado', 'error');
    }
}

// Sistema de Publicações
function initializePublicacoes() {
    const publicacaoForm = document.getElementById('publicacaoForm');

    publicacaoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewPublicacao();
    });
}

function addNewPublicacao() {
    const title = document.getElementById('publicacaoTitle').value;
    const description = document.getElementById('publicacaoDescription').value;
    const imageFile = document.getElementById('publicacaoImage').files[0];

    if (!title) {
        showMessage('Por favor, adicione um título', 'error');
        return;
    }

    const publicacao = {
        id: Date.now(),
        title: title,
        description: description,
        image: imageFile ? URL.createObjectURL(imageFile) : null,
        comments: [],
        date: new Date().toISOString()
    };

    const publicacoes = JSON.parse(localStorage.getItem('publicacoes') || '[]');
    publicacoes.unshift(publicacao);
    localStorage.setItem('publicacoes', JSON.stringify(publicacoes));

    displayPublicacoes(publicacoes);
    document.getElementById('publicacaoForm').reset();
    showMessage('Publicação adicionada com sucesso!', 'success');
}

function displayPublicacoes(publicacoes) {
    const publicacoesList = document.getElementById('publicacoesList');
    publicacoesList.innerHTML = '';

    publicacoes.forEach(publicacao => {
        const publicacaoItem = document.createElement('div');
        publicacaoItem.className = 'publicacao-item';
        
        publicacaoItem.innerHTML = `
            <div class="publicacao-image">
                ${publicacao.image ? 
                    `<img src="${publicacao.image}" alt="${publicacao.title}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                    '<i class="fas fa-image" style="font-size: 3rem; color: #ccc;"></i>'
                }
            </div>
            <div class="publicacao-content">
                <h3 class="publicacao-title">${publicacao.title}</h3>
                <p class="publicacao-description">${publicacao.description || 'Sem descrição'}</p>
                <small>${new Date(publicacao.date).toLocaleDateString('pt-PT')}</small>
                <div class="publicacao-comments">
                    <div class="comment-form">
                        <input type="text" placeholder="Adicionar comentário..." id="comment-${publicacao.id}">
                        <button onclick="addComment(${publicacao.id})" class="btn">Comentar</button>
                    </div>
                    <div id="comments-${publicacao.id}">
                        ${displayComments(publicacao.comments)}
                    </div>
                </div>
            </div>
        `;
        
        publicacoesList.appendChild(publicacaoItem);
    });
}

function displayComments(comments) {
    if (!comments || comments.length === 0) {
        return '<p style="color: #666; font-size: 0.9rem;">Sem comentários ainda</p>';
    }

    return comments.map(comment => `
        <div class="comment">
            <strong>${comment.author}:</strong> ${comment.text}
            <small>${new Date(comment.date).toLocaleDateString('pt-PT')}</small>
        </div>
    `).join('');
}

function addComment(publicacaoId) {
    const commentInput = document.getElementById(`comment-${publicacaoId}`);
    const commentText = commentInput.value.trim();

    if (!commentText) {
        showMessage('Por favor, escreva um comentário', 'error');
        return;
    }

    const publicacoes = JSON.parse(localStorage.getItem('publicacoes') || '[]');
    const publicacao = publicacoes.find(p => p.id === publicacaoId);

    if (publicacao) {
        if (!publicacao.comments) {
            publicacao.comments = [];
        }

        publicacao.comments.push({
            id: Date.now(),
            author: 'Utilizador',
            text: commentText,
            date: new Date().toISOString()
        });

        localStorage.setItem('publicacoes', JSON.stringify(publicacoes));
        displayPublicacoes(publicacoes);
        showMessage('Comentário adicionado!', 'success');
    }
}

// Sistema de Sócios
function initializeSocios() {
    const searchInput = document.getElementById('searchSocio');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterSocios(this.value);
        });
    }

    // Adicionar sócios de exemplo
    addExampleSocios();
}

function addExampleSocios() {
    const existingSocios = JSON.parse(localStorage.getItem('socios') || '[]');
    
    if (existingSocios.length === 0) {
        const exampleSocios = [
            { id: 1, name: 'João Silva', email: 'joao@email.com', phone: '912345678', status: 'active', joinDate: '2026-01-15' },
            { id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '923456789', status: 'active', joinDate: '2026-02-20' },
            { id: 3, name: 'Carlos Pereira', email: 'carlos@email.com', phone: '934567890', status: 'inactive', joinDate: '2025-12-10' }
        ];
        
        localStorage.setItem('socios', JSON.stringify(exampleSocios));
        displaySocios(exampleSocios);
    } else {
        displaySocios(existingSocios);
    }
}

function addNewSocio() {
    const name = prompt('Nome do sócio:');
    if (!name) return;

    const email = prompt('Email do sócio:');
    const phone = prompt('Telefone do sócio:');

    const socio = {
        id: Date.now(),
        name: name,
        email: email || 'não definido',
        phone: phone || 'não definido',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0]
    };

    const socios = JSON.parse(localStorage.getItem('socios') || '[]');
    socios.push(socio);
    localStorage.setItem('socios', JSON.stringify(socios));

    displaySocios(socios);
    showMessage('Sócio adicionado com sucesso!', 'success');
}

function displaySocios(socios) {
    const sociosList = document.getElementById('sociosList');
    const totalSocios = document.getElementById('totalSocios');
    const sociosAtivos = document.getElementById('sociosAtivos');

    sociosList.innerHTML = '';
    
    socios.forEach(socio => {
        const socioItem = document.createElement('div');
        socioItem.className = 'socio-item';
        socioItem.innerHTML = `
            <div class="socio-info">
                <h4>${socio.name}</h4>
                <p><strong>Nº Sócio:</strong> ${socio.id || 'N/A'}</p>
                <p><strong>Data de Adesão:</strong> ${new Date(socio.joinDate).toLocaleDateString('pt-PT')}</p>
            </div>
            <span class="socio-status ${socio.status === 'active' ? 'status-active' : 'status-inactive'}">
                ${socio.status === 'active' ? 'Ativo' : 'Inativo'}
            </span>
        `;
        sociosList.appendChild(socioItem);
    });

    // Atualizar estatísticas
    if (totalSocios) totalSocios.textContent = socios.length;
    if (sociosAtivos) sociosAtivos.textContent = socios.filter(s => s.status === 'active').length;
}

function filterSocios(searchTerm) {
    const socios = JSON.parse(localStorage.getItem('socios') || '[]');
    const filteredSocios = socios.filter(socio => 
        socio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        socio.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displaySocios(filteredSocios);
}

// Sistema de Reservas
function initializeReservas() {
    const reservaForm = document.getElementById('reservaForm');

    reservaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewReserva();
    });

    // Definir data mínima como hoje
    const dataInput = document.getElementById('dataReserva');
    dataInput.min = new Date().toISOString().split('T')[0];
}

function addNewReserva() {
    const nome = document.getElementById('nomeReserva').value;
    const telefone = document.getElementById('telefoneReserva').value;
    const data = document.getElementById('dataReserva').value;
    const prato = document.getElementById('pratoReserva').value;
    const quantidade = document.getElementById('quantidadeReserva').value;
    const observacoes = document.getElementById('observacoesReserva').value;

    if (!nome || !telefone || !data || !prato) {
        showMessage('Por favor, preencha todos os campos obrigatórios', 'error');
        return;
    }

    const reserva = {
        id: Date.now(),
        nome: nome,
        telefone: telefone,
        data: data,
        prato: prato,
        quantidade: parseInt(quantidade),
        observacoes: observacoes,
        status: 'pendente',
        createdAt: new Date().toISOString()
    };

    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    reservas.unshift(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));

    displayReservas(reservas);
    document.getElementById('reservaForm').reset();
    showMessage('Reserva feita com sucesso! Entraremos em contacto.', 'success');
}

function displayReservas(reservas) {
    const reservasList = document.getElementById('reservasList');
    reservasList.innerHTML = '';

    if (reservas.length === 0) {
        reservasList.innerHTML = '<p style="color: #666;">Nenhuma reserva encontrada</p>';
        return;
    }

    reservas.forEach(reserva => {
        const reservaItem = document.createElement('div');
        reservaItem.className = 'reserva-item';
        reservaItem.innerHTML = `
            <h4>${reserva.nome}</h4>
            <p><strong>Telefone:</strong> ${reserva.telefone}</p>
            <p><strong>Data:</strong> ${new Date(reserva.data).toLocaleDateString('pt-PT')}</p>
            <p><strong>Prato:</strong> ${getPratoName(reserva.prato)}</p>
            <p><strong>Quantidade:</strong> ${reserva.quantidade}</p>
            ${reserva.observacoes ? `<p><strong>Observações:</strong> ${reserva.observacoes}</p>` : ''}
            <p><strong>Estado:</strong> <span style="color: ${reserva.status === 'pendente' ? '#ffc107' : '#28a745'}">${reserva.status}</span></p>
            <small>Reserva feita em ${new Date(reserva.createdAt).toLocaleDateString('pt-PT')}</small>
        `;
        reservasList.appendChild(reservaItem);
    });
}

function getPratoName(pratoValue) {
    const pratos = {
        'bacalhau': 'Bacalhau à Brás',
        'frango': 'Frango no Churrasco',
        'carne': 'Carne de Porco Alentejana',
        'peixe': 'Peixe Grelhado',
        'vegetariano': 'Opção Vegetariana'
    };
    return pratos[pratoValue] || pratoValue;
}

// Sistema de mensagens
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.zIndex = '1000';
    messageDiv.style.padding = '1rem';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.maxWidth = '300px';

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Funções utilitárias
function formatMonth(monthString) {
    const [year, month] = monthString.split('-');
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
}

// Exportar dados (funcionalidade adicional)
function exportData() {
    const data = {
        reports: JSON.parse(localStorage.getItem('reports') || '[]'),
        publicacoes: JSON.parse(localStorage.getItem('publicacoes') || '[]'),
        socios: JSON.parse(localStorage.getItem('socios') || '[]'),
        reservas: JSON.parse(localStorage.getItem('reservas') || '[]')
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `associacao-almargem-backup-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Função para visualizar PDF
function viewReport(fileUrl) {
    window.open(fileUrl, '_blank');
}

// Função para fazer download do PDF
function downloadReport(fileName) {
    const link = document.createElement('a');
    link.href = './' + fileName;
    link.download = fileName;
    link.click();
    showMessage('Download iniciado', 'success');
}

// Sistema de Administração
function initializeAdministration() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminLogoutBtn = document.getElementById('adminLogout');
    const adminLogoutHeaderBtn = document.getElementById('adminLogoutBtn');
    const adminLoginHeaderBtn = document.getElementById('adminLoginBtn');
    const saveConfigBtn = document.getElementById('saveConfig');
    const pdfUploadForm = document.getElementById('pdfUploadForm');

    // Login de administrador
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;

            if (username === 'admin' && password === 'acrdm2026') {
                localStorage.setItem('isAdmin', 'true');
                showAdminPanel();
                loadTabConfigurations();
                showMessage('Login realizado com sucesso!', 'success');
            } else {
                showMessage('Credenciais inválidas!', 'error');
            }
        });
    }

    // Logout de administrador (painel)
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function() {
            localStorage.removeItem('isAdmin');
            hideAdminPanel();
            checkAdminStatus();
            showMessage('Logout realizado com sucesso!', 'success');
        });
    }

    // Login de administrador (header)
    if (adminLoginHeaderBtn) {
        adminLoginHeaderBtn.addEventListener('click', function() {
            showLoginModal();
        });
    }

    // Logout de administrador (header)
    if (adminLogoutHeaderBtn) {
        adminLogoutHeaderBtn.addEventListener('click', function() {
            localStorage.removeItem('isAdmin');
            hideAdminPanel();
            checkAdminStatus();
            showMessage('Logout realizado com sucesso!', 'success');
        });
    }

    // Guardar configurações
    if (saveConfigBtn) {
        saveConfigBtn.addEventListener('click', saveTabConfigurations);
    }

    // Upload de PDF
    if (pdfUploadForm) {
        pdfUploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            uploadPDF();
        });
    }
}

function checkAdminStatus() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (isAdmin) {
        // showAdminPanel trata dos botões do header internamente
        showAdminPanel();
    } else {
        const adminLoginBtn = document.getElementById('adminLoginBtn');
        const adminLogoutBtn = document.getElementById('adminLogoutBtn');
        if (adminLoginBtn)  adminLoginBtn.style.display  = 'block';
        if (adminLogoutBtn) adminLogoutBtn.style.display = 'none';
    }

    loadTabConfigurations();
    loadUploadedPDFs();
}

function showAdminPanel() {
    const adminLogin = document.getElementById('adminLogin');
    const adminPanel = document.getElementById('adminPanel');
    const adminOnlyItems = document.querySelectorAll('.admin-only');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');

    if (adminLogin) adminLogin.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'block';

    adminOnlyItems.forEach(item => {
        item.style.display = 'block';
    });

    // Corrigir botões do header: login oculto, logout visível
    if (adminLoginBtn)  adminLoginBtn.style.display  = 'none';
    if (adminLogoutBtn) adminLogoutBtn.style.display = 'block';

    renderAdminDocs();
    renderAdminReunioes();
    // Carregar token guardado
    const savedToken = localStorage.getItem('githubToken');
    const tokenInput = document.getElementById('githubTokenInput');
    const tokenStatus = document.getElementById('githubTokenStatus');
    if (tokenInput && savedToken) {
        tokenInput.value = savedToken;
        if (tokenStatus) tokenStatus.textContent = '✓ Token configurado';
    }
}

function saveGithubToken() {
    const val = (document.getElementById('githubTokenInput') || {}).value?.trim();
    const status = document.getElementById('githubTokenStatus');
    if (!val) { if (status) status.textContent = 'Token vazio — não guardado.'; return; }
    localStorage.setItem('githubToken', val);
    if (status) status.textContent = '✓ Token guardado com sucesso.';
    showMessage('Token GitHub guardado.', 'success');
}

function hideAdminPanel() {
    const adminLogin = document.getElementById('adminLogin');
    const adminPanel = document.getElementById('adminPanel');
    const adminOnlyItems = document.querySelectorAll('.admin-only');

    if (adminLogin) adminLogin.style.display = 'block';
    if (adminPanel) adminPanel.style.display = 'none';
    
    adminOnlyItems.forEach(item => {
        if (!item.id || !item.id.includes('adminLoginBtn') && !item.id.includes('adminLogoutBtn')) {
            item.style.display = 'none';
        }
    });
}

function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Login de Administrador</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <form id="modalAdminLoginForm">
                    <div class="form-group">
                        <label for="modalUsername">Utilizador:</label>
                        <input type="text" id="modalUsername" required>
                    </div>
                    <div class="form-group">
                        <label for="modalPassword">Password:</label>
                        <input type="password" id="modalPassword" required>
                    </div>
                    <button type="submit" class="btn">Entrar</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Event listeners
    const closeBtn = modal.querySelector('.close-modal');
    const form = modal.querySelector('#modalAdminLoginForm');
    
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('modalUsername').value;
        const password = document.getElementById('modalPassword').value;
        
        if (username === 'admin' && password === 'acrdm2026') {
            localStorage.setItem('isAdmin', 'true');
            showAdminPanel();
            checkAdminStatus();
            document.body.removeChild(modal);
            showMessage('Login realizado com sucesso!', 'success');
            
            // Abrir separador de administração
            const adminTab = document.querySelector('[data-tab="administracao"]');
            if (adminTab) {
                adminTab.click();
            }
        } else {
            showMessage('Credenciais inválidas!', 'error');
        }
    });
}

function saveTabConfigurations() {
    const config = {
        relatorios: document.getElementById('toggleRelatorios').checked,
        publicacoes: document.getElementById('togglePublicacoes').checked,
        socios: document.getElementById('toggleSocios').checked,
        reservas: document.getElementById('toggleReservas').checked
    };

    localStorage.setItem('tabConfig', JSON.stringify(config));
    applyTabConfigurations(config);
    showMessage('Configurações guardadas com sucesso!', 'success');
}

function loadTabConfigurations() {
    const savedConfig = localStorage.getItem('tabConfig');
    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        
        document.getElementById('toggleRelatorios').checked = config.relatorios !== false;
        document.getElementById('togglePublicacoes').checked = config.publicacoes !== false;
        document.getElementById('toggleSocios').checked = config.socios !== false;
        document.getElementById('toggleReservas').checked = config.reservas !== false;
        
        applyTabConfigurations(config);
    } else {
        // Configuração padrão — apenas Contactos e Relatórios visíveis publicamente
        const defaultConfig = {
            relatorios: true,
            publicacoes: false,
            socios: false,
            reservas: false
        };
        
        document.getElementById('toggleRelatorios').checked = defaultConfig.relatorios;
        document.getElementById('togglePublicacoes').checked = defaultConfig.publicacoes;
        document.getElementById('toggleSocios').checked = defaultConfig.socios;
        document.getElementById('toggleReservas').checked = defaultConfig.reservas;
        
        applyTabConfigurations(defaultConfig);
    }
}

function applyTabConfigurations(config) {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    const tabMap = {
        relatorios: document.querySelector('[data-tab="relatorios"]'),
        publicacoes: document.querySelector('[data-tab="publicacoes"]'),
        socios:     document.querySelector('[data-tab="socios"]'),
        reservas:   document.querySelector('[data-tab="reservas"]')
    };

    Object.entries(tabMap).forEach(([name, el]) => {
        if (!el) return;
        const visible = config[name] !== false;

        // Remove badge anterior
        el.querySelector('.tab-hidden-badge')?.remove();

        if (isAdmin) {
            // Admin vê sempre todos os separadores;
            // os ocultos ficam com opacidade reduzida + ícone de aviso
            el.style.display = 'block';
            el.style.opacity = visible ? '1' : '0.45';
            el.title = visible ? '' : 'Oculto para visitantes';
            if (!visible) {
                const badge = document.createElement('span');
                badge.className = 'tab-hidden-badge';
                badge.title = 'Oculto para visitantes';
                badge.style.cssText = 'font-size:0.6em;margin-left:4px;vertical-align:middle;';
                badge.innerHTML = '<i class="fas fa-eye-slash"></i>';
                el.appendChild(badge);
            }
        } else {
            // Visitantes: aplica a configuração estritamente
            el.style.display = visible ? '' : 'none';
            el.style.opacity = '';
            el.title = '';
        }
    });
}

function uploadPDF() {
    const tipo = document.getElementById('pdfTipo').value;
    const pdfFile = document.getElementById('adminPdfFile').files[0];

    if (!tipo || !pdfFile) {
        showMessage('Por favor, selecione o tipo e o ficheiro PDF.', 'error');
        return;
    }

    // Reuniões de Direção → publica no GitHub (visível para todos)
    if (tipo === 'reunioes_direcao') {
        const titulo  = (document.getElementById('reuniaoTitulo')  || {}).value?.trim();
        const periodo = (document.getElementById('reuniaoPeriodo') || {}).value?.trim();
        const tag     = (document.getElementById('reuniaoTag')     || {}).value || null;
        if (!titulo || !periodo) {
            showMessage('Preencha o título e a data da reunião.', 'error');
            return;
        }
        const hoje = new Date().toLocaleDateString('pt-PT');
        uploadReuniao(pdfFile, { titulo, periodo, tag, data: hoje });
        return;
    }

    // Outros tipos → localStorage (apenas local)
    const mes = document.getElementById('pdfMes').value;
    const ano = document.getElementById('pdfAno').value;
    if (!mes || !ano) {
        showMessage('Por favor, preencha todos os campos obrigatórios!', 'error');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const pdfData = {
            id: Date.now(), tipo, mes, ano,
            nome: pdfFile.name,
            data: e.target.result,
            dataUpload: new Date().toISOString()
        };
        const pdfs = JSON.parse(localStorage.getItem('uploadedPDFs') || '[]');
        pdfs.push(pdfData);
        localStorage.setItem('uploadedPDFs', JSON.stringify(pdfs));
        document.getElementById('pdfUploadForm').reset();
        loadUploadedPDFs();
        showMessage('PDF carregado com sucesso!', 'success');
    };
    reader.readAsDataURL(pdfFile);
}

function loadUploadedPDFs() {
    const pdfs = JSON.parse(localStorage.getItem('uploadedPDFs') || '[]');
    const pdfsList = document.getElementById('pdfsList');
    
    if (pdfsList) {
        pdfsList.innerHTML = '';
        
        pdfs.sort((a, b) => new Date(b.dataUpload) - new Date(a.dataUpload));
        
        pdfs.forEach(pdf => {
            const pdfItem = document.createElement('div');
            pdfItem.className = 'pdf-item';
            
            const tipoLabels = {
                balancete: 'Balancete',
                relatorio_anual: 'Relatório Anual',
                extrato: 'Extrato',
                rcbe: 'RCBE',
                doc_legal_fiscal: 'Documentação Legal/Fiscal',
                estatutos: 'Estatutos',
                atas: 'Atas',
                reunioes_internas: 'Reuniões Internas',
                outros: 'Outros'
            };
            const tipoText = tipoLabels[pdf.tipo] || pdf.tipo;
            const mesText = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][parseInt(pdf.mes)];
            
            pdfItem.innerHTML = `
                <div>
                    <strong>${tipoText} - ${mesText} ${pdf.ano}</strong>
                    <br><small>${pdf.nome}</small>
                </div>
                <div>
                    <button onclick="viewUploadedPDF('${pdf.id}')" class="btn btn-small">Visualizar</button>
                    <button onclick="deleteUploadedPDF('${pdf.id}')" class="btn btn-small btn-danger">Eliminar</button>
                </div>
            `;
            
            pdfsList.appendChild(pdfItem);
        });
    }
}

function viewUploadedPDF(pdfId) {
    const pdfs = JSON.parse(localStorage.getItem('uploadedPDFs') || '[]');
    const pdf = pdfs.find(p => p.id == pdfId);
    
    if (pdf) {
        const byteCharacters = atob(pdf.data.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        window.open(url, '_blank');
    }
}

function deleteUploadedPDF(pdfId) {
    if (confirm('Tem certeza que pretende eliminar este PDF?')) {
        const pdfs = JSON.parse(localStorage.getItem('uploadedPDFs') || '[]');
        const updatedPDFs = pdfs.filter(p => p.id != pdfId);
        localStorage.setItem('uploadedPDFs', JSON.stringify(updatedPDFs));
        loadUploadedPDFs();
        showMessage('PDF eliminado com sucesso!', 'success');
    }
}

// Limpar dados (funcionalidade adicional)
function clearData() {
    if (confirm('Tem a certeza que pretende limpar todos os dados? Esta ação não pode ser desfeita.')) {
        localStorage.clear();
        location.reload();
    }
}

// Função para inicializar formulário de adesão
function initializeAdesaoForm() {
    const adesaoForm = document.getElementById('adesaoForm');
    
    if (adesaoForm) {
        adesaoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar campos obrigatórios
            const nomeCompleto = document.getElementById('nomeCompleto').value.trim();
            const dataNascimento = document.getElementById('dataNascimento').value;
            const contribuinte = document.getElementById('contribuinte').value.trim();
            const email = document.getElementById('email').value.trim();
            const termos = document.getElementById('termos').checked;
            
            // Validações
            if (!nomeCompleto || !dataNascimento || !contribuinte || !email) {
                alert('Por favor, preencha todos os campos obrigatórios marcados com *');
                return;
            }
            
            // Validar NIF (9 dígitos)
            if (!/^\d{9}$/.test(contribuinte)) {
                alert('O Nº Contribuinte deve ter exatamente 9 dígitos');
                return;
            }
            
            // Validar email
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Por favor, insira um email válido');
                return;
            }
            
            // Validar idade (mínimo 18 anos)
            const dataNasc = new Date(dataNascimento);
            const hoje = new Date();
            let idade = hoje.getFullYear() - dataNasc.getFullYear();
            const mesDiff = hoje.getMonth() - dataNasc.getMonth();
            
            if (mesDiff < 0 || (mesDiff === 0 && hoje.getDate() < dataNascimento.getDate())) {
                idade--;
            }
            
            if (idade < 18) {
                alert('É necessário ter pelo menos 18 anos para se tornar sócio');
                return;
            }
            
            try {
                // Criar objeto com dados do sócio
                const dadosSocio = {
                    nomeCompleto: nomeCompleto,
                    dataNascimento: dataNascimento,
                    contribuinte: contribuinte,
                    email: email,
                    termos: termos
                };
                
                const pdfHTML = criarFormularioSocio(dadosSocio);
                const enviado = enviarFormularioPorEmail(dadosSocio, pdfHTML);
                
                if (enviado) {
                    // Mostrar mensagem de sucesso
                    showSuccessMessage(dadosSocio);
                    
                    // Limpar formulário
                    adesaoForm.reset();
                    
                    // Guardar registo local
                    guardarAdesaoLocal(dadosSocio);
                }
            } catch (error) {
                console.error('Erro ao processar adesão:', error);
                alert('Ocorreu um erro ao processar a sua adesão. Por favor, tente novamente.');
            }
        });
    }
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage(dadosSocio) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 500px;
        text-align: center;
        border: 2px solid #347474;
    `;
    
    successDiv.innerHTML = `
        <h3 style="color: #347474; margin-bottom: 15px;">🎉 Adesão Recebida!</h3>
        <p style="margin-bottom: 15px;">Olá <strong>${dadosSocio.nomeCompleto}</strong>,</p>
        <p style="margin-bottom: 15px;">O seu formulário de adesão foi gerado com sucesso!</p>
        <p style="margin-bottom: 15px;">Uma nova janela abriu com o seu formulário em PDF.</p>
        <p style="margin-bottom: 20px; font-size: 14px; color: #666;">
            <strong>Próximos passos:</strong><br>
            1. Imprima o formulário que abriu<br>
            2. Efetue o pagamento da quota (12€) para:<br>
            <strong>IBAN: PT50 0045 5310 4010 3909 03339</strong><br>
            3. Envie o formulário assinado + comprovativo para:<br>
            <strong>ACRDM_ALMARGEM@HOTMAIL.COM</strong>
        </p>
        <button onclick="this.parentElement.remove()" style="
            background: linear-gradient(135deg, #347474 0%, #4a8c8c 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        ">Entendido</button>
    `;
    
    document.body.appendChild(successDiv);
    
    // Remover automaticamente após 10 segundos
    setTimeout(() => {
        if (successDiv.parentElement) {
            successDiv.remove();
        }
    }, 10000);
}

// Função para guardar adesão localmente
function guardarAdesaoLocal(dadosSocio) {
    const adesoes = JSON.parse(localStorage.getItem('adesoes') || '[]');
    adesoes.push({
        ...dadosSocio,
        dataAdesao: new Date().toISOString(),
        status: 'pendente_pagamento'
    });
    localStorage.setItem('adesoes', JSON.stringify(adesoes));
}
