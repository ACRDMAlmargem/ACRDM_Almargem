// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeReports();
    initializePublicacoes();
    initializeSocios();
    initializeReservas();
    initializeAdesaoForm();
});

// Sistema de abas
function initializeTabs() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remover classe active de todos os itens
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adicionar classe active ao item clicado
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
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
function initializeReports() {
    // Mostrar apenas o Balancete - Março 2026
    const reportsList = document.getElementById('reportsList');
    
    if (reportsList) {
        reportsList.innerHTML = `
            <div class="report-card">
                <div class="report-info">
                    <h4>Balancete - Março 2026</h4>
                    <p><strong>Data:</strong> 31/03/2026</p>
                </div>
                <div class="report-actions">
                    <button onclick="viewReport('./Balancete.pdf')" class="btn btn-small">Visualizar</button>
                    <button onclick="downloadReport('Balancete.pdf')" class="btn btn-small btn-secondary">Exportar PDF</button>
                </div>
            </div>
        `;
    }
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
    if (fileUrl === './Balancete.pdf') {
        window.open(fileUrl, '_blank');
    } else {
        showMessage('PDF não encontrado', 'error');
    }
}

// Função para fazer download do PDF
function downloadReport(fileName) {
    if (fileName === 'Balancete.pdf') {
        const link = document.createElement('a');
        link.href = './Balancete.pdf';
        link.download = fileName;
        link.click();
        showMessage('Download iniciado', 'success');
    } else {
        showMessage('PDF não encontrado', 'error');
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
