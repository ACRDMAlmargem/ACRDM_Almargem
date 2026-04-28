// Biblioteca simples para geração de PDF
class SimplePDFGenerator {
    constructor() {
        this.content = [];
        this.y = 20;
        this.pageHeight = 280;
        this.pageWidth = 210;
        this.margin = 20;
    }

    addText(text, x, y, fontSize = 12, isBold = false) {
        this.content.push({
            type: 'text',
            text: text,
            x: x || this.margin,
            y: y || this.y,
            fontSize: fontSize,
            isBold: isBold
        });
        this.y += fontSize + 5;
    }

    addLine(x1, y1, x2, y2) {
        this.content.push({
            type: 'line',
            x1: x1 || this.margin,
            y1: y1 || this.y,
            x2: x2 || (this.pageWidth - this.margin),
            y2: y2 || this.y
        });
        this.y += 10;
    }

    addImage(base64, x, y, width, height) {
        this.content.push({
            type: 'image',
            base64: base64,
            x: x || this.margin,
            y: y || this.y,
            width: width || 50,
            height: height || 50
        });
        this.y += height + 10;
    }

    generatePDF() {
        // Criar HTML para impressão em PDF
        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Formulário de Adesão - ACRMA</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px; 
                    line-height: 1.6;
                    color: #333;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #347474;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .logo {
                    width: 80px;
                    height: 80px;
                    margin-bottom: 10px;
                }
                .title {
                    color: #347474;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .section {
                    margin-bottom: 25px;
                }
                .section-title {
                    color: #347474;
                    font-size: 18px;
                    font-weight: bold;
                    border-bottom: 1px solid #e1e8e8;
                    padding-bottom: 5px;
                    margin-bottom: 15px;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .info-item {
                    padding: 8px;
                    background: #f8f9fa;
                    border-radius: 5px;
                }
                .info-label {
                    font-weight: bold;
                    color: #666;
                    font-size: 12px;
                }
                .info-value {
                    color: #333;
                    font-size: 14px;
                }
                .payment-info {
                    background: #e6f3f3;
                    padding: 20px;
                    border-radius: 8px;
                    border-left: 4px solid #347474;
                }
                .payment-title {
                    font-weight: bold;
                    color: #347474;
                    margin-bottom: 10px;
                }
                .bank-info {
                    background: white;
                    padding: 15px;
                    border-radius: 5px;
                    margin-top: 10px;
                }
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    border-top: 1px solid #e1e8e8;
                    padding-top: 20px;
                }
                @media print {
                    body { margin: 10px; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
        `;

        // Adicionar conteúdo dinamicamente
        this.content.forEach(item => {
            switch(item.type) {
                case 'text':
                    html += `<div style="position: absolute; left: ${item.x}mm; top: ${item.y}mm; font-size: ${item.fontSize}px; ${item.isBold ? 'font-weight: bold;' : ''}">${item.text}</div>`;
                    break;
                case 'line':
                    html += `<div style="position: absolute; left: ${item.x}mm; top: ${item.y}mm; width: ${item.x2 - item.x}mm; height: 1px; background: #333;"></div>`;
                    break;
                case 'image':
                    html += `<img src="${item.base64}" style="position: absolute; left: ${item.x}mm; top: ${item.y}mm; width: ${item.width}px; height: ${item.height}px;">`;
                    break;
            }
        });

        html += `
        </body>
        </html>`;

        return html;
    }
}

// Função para criar formulário de sócio em PDF
function criarFormularioSocio(dadosSocio) {
    const pdf = new SimplePDFGenerator();
    
    // Converter logo SVG para base64 (simplificado)
    const logoBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncmVlbkdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzM0NzQ3NDtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0YThjOGM7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzVjYTBhMDtzdG9wLW9wYWNpdHk6MSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iODUiIGZpbGw9InVybCgjZ3JlZW5HcmFkaWVudCkiIG9wYWNpdHk9IjAuMSIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzQ3NDc0Ij5BQ1JNQTwvdGV4dD4KICA8dGV4dCB4PSIxMDAiIHk9IjE4NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzQ3NDc0Ij5BTE1BUkdFTTwvdGV4dD4KPC9zdmc+';

    // Criar HTML do formulário
    const formularioHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Formulário de Adesão - ACRMA</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                line-height: 1.6;
                color: #333;
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #347474;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .logo {
                width: 80px;
                height: 80px;
                margin-bottom: 10px;
            }
            .title {
                color: #347474;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #666;
                font-size: 14px;
                margin-bottom: 5px;
            }
            .section {
                margin-bottom: 25px;
            }
            .section-title {
                color: #347474;
                font-size: 18px;
                font-weight: bold;
                border-bottom: 1px solid #e1e8e8;
                padding-bottom: 5px;
                margin-bottom: 15px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 20px;
            }
            .info-item {
                padding: 8px;
                background: #f8f9fa;
                border-radius: 5px;
            }
            .info-label {
                font-weight: bold;
                color: #666;
                font-size: 12px;
            }
            .info-value {
                color: #333;
                font-size: 14px;
            }
            .payment-info {
                background: #e6f3f3;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #347474;
            }
            .payment-title {
                font-weight: bold;
                color: #347474;
                margin-bottom: 10px;
            }
            .bank-info {
                background: white;
                padding: 15px;
                border-radius: 5px;
                margin-top: 10px;
            }
            .footer {
                margin-top: 40px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #e1e8e8;
                padding-top: 20px;
            }
            .date {
                text-align: right;
                font-style: italic;
                color: #666;
                margin-bottom: 20px;
            }
            @media print {
                body { margin: 10px; }
                .no-print { display: none; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <img src="${logoBase64}" alt="Logo ACRMA" class="logo">
            <div class="title">Associação Cultural e Recreativa dos Moradores de Almargem</div>
            <div class="subtitle">NIF: 502197463</div>
            <div class="subtitle">Formulário de Adesão de Sócio</div>
        </div>

        <div class="date">Data: ${new Date().toLocaleDateString('pt-PT')}</div>

        <div class="section">
            <div class="section-title">Dados Pessoais</div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Nome Completo:</div>
                    <div class="info-value">${dadosSocio.nomeCompleto}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Data de Nascimento:</div>
                    <div class="info-value">${new Date(dadosSocio.dataNascimento).toLocaleDateString('pt-PT')}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Nº Contribuinte:</div>
                    <div class="info-value">${dadosSocio.contribuinte}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Email:</div>
                    <div class="info-value">${dadosSocio.email}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Telefone:</div>
                    <div class="info-value">${dadosSocio.telefone || 'Não indicado'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Código Postal:</div>
                    <div class="info-value">${dadosSocio.codigoPostal || 'Não indicado'}</div>
                </div>
            </div>
            ${dadosSocio.morada ? `
            <div class="info-item">
                <div class="info-label">Morada:</div>
                <div class="info-value">${dadosSocio.morada}</div>
            </div>
            ` : ''}
        </div>

        <div class="section">
            <div class="section-title">Informação de Pagamento</div>
            <div class="payment-info">
                <div class="payment-title">Quota Anual: 12,00€</div>
                <p>Para tornar-se sócio da ACRMA, efetue o pagamento da quota anual através dos seguintes dados bancários:</p>
                <div class="bank-info">
                    <div class="info-item">
                        <div class="info-label">IBAN:</div>
                        <div class="info-value">PT50 0045 5310 4010 3909 03339</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">NIB:</div>
                        <div class="info-value">0045 5310 4010 3909 03339</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Entidade:</div>
                        <div class="info-value">Caixa Geral de Depósitos</div>
                    </div>
                </div>
                <p style="margin-top: 15px; font-size: 12px; color: #666;">
                    Após pagamento, envie comprovativo para: ACRDM_ALMARGEM@HOTMAIL.COM
                </p>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Declaração</div>
            <p>Eu, ${dadosSocio.nomeCompleto}, declaro que li e aceito os estatutos da Associação Cultural e Recreativa dos Moradores de Almargem e autorizo o tratamento dos meus dados para fins associativos.</p>
            <div style="margin-top: 30px;">
                <div style="border-bottom: 1px solid #333; width: 200px; margin-bottom: 5px;"></div>
                <div style="font-size: 12px; color: #666;">Assinatura do Sócio</div>
            </div>
        </div>

        <div class="footer">
            <div><strong>Associação Cultural e Recreativa dos Moradores de Almargem</strong></div>
            <div>Email: ACRDM_ALMARGEM@HOTMAIL.COM</div>
            <div>Facebook: /profile.php?id=61577468277679</div>
            <div>Almargem, Portugal</div>
        </div>
    </body>
    </html>
    `;

    return formularioHTML;
}

// Função para enviar email com PDF (simulação - na prática precisaria de backend)
function enviarFormularioPorEmail(dadosSocio, pdfHTML) {
    // Em produção, isto enviaria para um servidor
    // Por agora, vamos simular e guardar localmente
    
    // Criar blob do HTML
    const blob = new Blob([pdfHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Abrir numa nova janela para impressão
    const printWindow = window.open(url, '_blank');
    
    // Tentar imprimir automaticamente
    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };
    
    // Guardar no localStorage para registo
    const adesoes = JSON.parse(localStorage.getItem('adesoes') || '[]');
    adesoes.push({
        ...dadosSocio,
        dataAdesao: new Date().toISOString(),
        status: 'pendente'
    });
    localStorage.setItem('adesoes', JSON.stringify(adesoes));
    
    return true;
}
