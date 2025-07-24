(function() {
    if (document.getElementById('temporizadorGustavoMS')) return;

    const container = document.createElement('div');
    container.id = 'temporizadorGustavoMS';
    container.style.position = 'fixed';
    container.style.top = '100px';
    container.style.left = '100px';
    container.style.background = '#f4e4c1';
    container.style.border = '2px solid #653f10';
    container.style.padding = '10px';
    container.style.fontFamily = 'Verdana, sans-serif';
    container.style.zIndex = '9999';
    container.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
    container.style.borderRadius = '6px';
    container.style.minWidth = '270px';

    const titulo = document.createElement('div');
    titulo.textContent = 'Temporizador de Comandos ATK';
    titulo.style.fontWeight = 'bold';
    titulo.style.marginBottom = '8px';
    titulo.style.cursor = 'move';
    titulo.style.userSelect = 'none';
    titulo.style.position = 'relative';
    container.appendChild(titulo);

    const fechar = document.createElement('span');
    fechar.textContent = '×';
    fechar.title = 'Fechar';
    fechar.style.position = 'absolute';
    fechar.style.top = '6px';
    fechar.style.right = '8px';
    fechar.style.cursor = 'pointer';
    fechar.style.color = '#653f10';
    fechar.style.fontWeight = 'bold';
    fechar.style.fontSize = '16px';
    fechar.style.padding = '2px 4px';
    fechar.style.lineHeight = '1';
    fechar.style.borderRadius = '4px';
    fechar.style.userSelect = 'none';
    fechar.onmouseenter = () => fechar.style.backgroundColor = '#e0c8a0';
    fechar.onmouseleave = () => fechar.style.backgroundColor = 'transparent';
    fechar.onclick = () => container.remove();
    container.appendChild(fechar);

    const label = document.createElement('label');
    label.textContent = 'Horário de Lançamento';
    label.style.display = 'block';
    label.style.marginBottom = '4px';
    container.appendChild(label);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '23:08:09.000 23/07/2025';
    input.style.width = 'calc(100% - 10px)';
    input.style.padding = '4px';
    input.style.border = '1px solid #aaa';
    input.style.borderRadius = '4px';
    input.style.fontSize = '14px';
    container.appendChild(input);

    const relogio = document.createElement('div');
    relogio.style.marginTop = '8px';
    relogio.style.fontSize = '14px';
    relogio.style.color = '#333';
    relogio.textContent = '🕒 --:--:--.--- --/--/----';
    container.appendChild(relogio);

    const botaoCopiar = document.createElement('button');
    botaoCopiar.textContent = '📋 Copiar horário atual';
    botaoCopiar.style.marginTop = '6px';
    botaoCopiar.style.width = '100%';
    botaoCopiar.style.padding = '4px';
    botaoCopiar.style.border = '1px solid #888';
    botaoCopiar.style.borderRadius = '4px';
    botaoCopiar.style.backgroundColor = '#efe1b0';
    botaoCopiar.style.cursor = 'pointer';
    botaoCopiar.style.fontSize = '13px';
    container.appendChild(botaoCopiar);

    const botaoAtivar = document.createElement('button');
    botaoAtivar.textContent = '⏱ Enviar';
    botaoAtivar.style.marginTop = '10px';
    botaoAtivar.style.width = '100%';
    botaoAtivar.style.padding = '5px';
    botaoAtivar.style.border = '1px solid #888';
    botaoAtivar.style.borderRadius = '4px';
    botaoAtivar.style.backgroundColor = '#d4c097';
    botaoAtivar.style.fontWeight = 'bold';
    botaoAtivar.style.cursor = 'pointer';
    container.appendChild(botaoAtivar);

    const latenciaInfo = document.createElement('div');
    latenciaInfo.style.marginTop = '6px';
    latenciaInfo.style.fontSize = '13px';
    latenciaInfo.style.color = '#555';
    latenciaInfo.style.textAlign = 'center';
    latenciaInfo.textContent = '';
    container.appendChild(latenciaInfo);

    const statusExecucao = document.createElement('div');
    statusExecucao.style.marginTop = '6px';
    statusExecucao.style.fontSize = '13px';
    statusExecucao.style.fontStyle = 'italic';
    statusExecucao.style.color = '#444';
    statusExecucao.style.textAlign = 'center';
    statusExecucao.textContent = '';
    container.appendChild(statusExecucao);

    const creditos = document.createElement('div');
    creditos.textContent = 'By Gustavo.M.S.';
    creditos.style.fontSize = '12px';
    creditos.style.color = '#666';
    creditos.style.marginTop = '8px';
    creditos.style.textAlign = 'center';
    container.appendChild(creditos);

    let horarioFormatado = '';
    let latenciaMs = 0;

    setInterval(() => {
        const agora = new Date();
        const h = String(agora.getHours()).padStart(2, '0');
        const m = String(agora.getMinutes()).padStart(2, '0');
        const s = String(agora.getSeconds()).padStart(2, '0');
        const ms = String(agora.getMilliseconds()).padStart(3, '0');
        const dia = String(agora.getDate()).padStart(2, '0');
        const mes = String(agora.getMonth() + 1).padStart(2, '0');
        const ano = agora.getFullYear();
    horarioFormatado = `${h}:${m}:${s}.${ms} ${dia}/${mes}/${ano}`;
    relogio.textContent = `🕒 ${horarioFormatado}`;

    const latenciaStr = document.querySelector('#serverTime')?.getAttribute('title');
    if (latenciaStr && latenciaStr.includes('Latency')) {
        const match = latenciaStr.match(/Latency:\s*([\d.]+)ms/);
        if (match) {
            latenciaMs = parseFloat(match[1]);
            latenciaInfo.textContent = `📡 Latência detectada: ${latenciaMs.toFixed(1)}ms`;
        } else {
            latenciaMs = 0;
            latenciaInfo.textContent = '⚠️ Latência não detectada – envio será no horário exato';
        }
    }
}, 1);

    botaoCopiar.addEventListener('click', () => {
        input.value = horarioFormatado;
        navigator.clipboard.writeText(horarioFormatado)
            .then(() => statusExecucao.textContent = '📋 Horário preenchido e copiado!')
            .catch(() => statusExecucao.textContent = '❌ Falha ao copiar horário.');
    });

    botaoAtivar.addEventListener('click', () => {
        const valor = input.value.trim();
        const regex = /^(\d{2}):(\d{2}):(\d{2})[.,](\d{3}) (\d{2})\/(\d{2})\/(\d{4})$/;

        if (!regex.test(valor)) {
            alert('Formato inválido! Use: HH:MM:SS.mmm DD/MM/AAAA');
            return;
        }

        const [, hh, mm, ss, ms, dia, mes, ano] = valor.match(regex).map(Number);
        const dataAlvo = new Date(ano, mes - 1, dia, hh, mm, ss, ms);
        dataAlvo.setMilliseconds(dataAlvo.getMilliseconds() - latenciaMs);

        statusExecucao.textContent = '⏳ Código em execução... aguardando horário exato';

        const intervalo = setInterval(() => {
            const agora = new Date();
            if (agora >= dataAlvo) {
                const botao = document.querySelector('#troop_confirm_submit');
                if (botao) {
                    const evento = new MouseEvent('click', { bubbles: true, cancelable: true });
                    botao.dispatchEvent(evento);
                    statusExecucao.textContent = '✅ Ataque enviado com sucesso!';
                } else {
                    statusExecucao.textContent = '⚠️ Botão não encontrado!';
                }
                clearInterval(intervalo);
            }
        }, 1);
    });

    document.body.appendChild(container);

    let isDragging = false, offsetX, offsetY;
    titulo.addEventListener('mousedown', function(e) {
        if (e.target === fechar) return;
        isDragging = true;
        offsetX = e.clientX - container.offsetLeft;
        offsetY = e.clientY - container.offsetTop;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            container.style.left = (e.clientX - offsetX) + 'px';
            container.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        document.body.style.userSelect = '';
    });
})();
