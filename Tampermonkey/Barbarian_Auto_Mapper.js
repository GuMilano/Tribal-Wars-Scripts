// ==UserScript==
// @name         AutoFarm Brbs FINAL (Popup Config + Delay + Fechar)
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  AutoFarm com popup estilizado, delay configurável, reset, drag e botão fechar
// @match        *://*.tribalwars.com.br/game.php*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    let running = false;

    function getTroopConfig() {
        return {
            spear: parseInt(localStorage.getItem("autoFarm_spear") || "0"),
            sword: parseInt(localStorage.getItem("autoFarm_sword") || "0"),
            axe: parseInt(localStorage.getItem("autoFarm_axe") || "0"),
            light: parseInt(localStorage.getItem("autoFarm_light") || "0"),
            spy: parseInt(localStorage.getItem("autoFarm_spy") || "1"),
        };
    }

    function getDelay() {
        return parseInt(localStorage.getItem("autoFarm_delay") || "700000"); // 700s padrão
    }

    function saveTroopConfig() {
        document.querySelectorAll(".autoFarmInput").forEach(input => {
            localStorage.setItem(input.dataset.key, input.value);
        });
    }

    function resetConfig() {
        ["autoFarmCoords","autoFarm_spear","autoFarm_sword","autoFarm_axe","autoFarm_light","autoFarm_spy","autoFarm_delay"]
            .forEach(k=> localStorage.removeItem(k));
        alert("⚠️ Configuração resetada!");
        document.querySelectorAll(".autoFarmInput").forEach(input => input.value = 0);
        document.querySelector("#autoFarmDelay").value = 700000;
        updateButtonText();
    }

    function updateButtonText() {
        let btn = document.getElementById("autoFarmBtn");
        if (!btn) return;
        let coords = JSON.parse(localStorage.getItem("autoFarmCoords") || "[]");
        btn.textContent = (running ? "⏸️ Parar AutoFarm" : "▶️ Iniciar AutoFarm") + ` (${coords.length})`;
    }

    function createPopup() {
        if (document.getElementById("autoFarmPopup")) return;

        let popup = document.createElement("div");
        popup.id = "autoFarmPopup";
        Object.assign(popup.style, {
            position: "fixed",
            top: "100px",
            left: "20px",
            background: "#f4e4bc",
            border: "3px solid #804000",
            borderRadius: "10px",
            padding: "12px",
            zIndex: "9999",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            fontFamily: "Verdana, sans-serif",
            minWidth: "230px",
            cursor: "move"
        });

        // Botão X
        let closeBtn = document.createElement("div");
        closeBtn.textContent = "✖";
        Object.assign(closeBtn.style, {
            position: "absolute",
            top: "3px",
            right: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            color: "#b00"
        });
        closeBtn.addEventListener("click", () => popup.style.display = "none");

        let title = document.createElement("div");
        title.textContent = "🌾 Barbarian Auto Mapper ";
        Object.assign(title.style, {
            fontWeight: "bold",
            fontSize: "16px",
            marginBottom: "10px",
            color: "#5a2d00",
            textAlign: "center"
        });

        // Configuração de tropas
        let troopDiv = document.createElement("div");
        troopDiv.innerHTML = `
            <b>⚙️ Tropas:</b><br>
            <table style="width: 100%; font-size:13px; margin-top:4px;">
                <tr><td>🛡️ Lançeiros:</td><td><input type="number" class="autoFarmInput" data-key="autoFarm_spear" min="0" style="width:50px"></td></tr>
                <tr><td>⚔️ Espadachin:</td><td><input type="number" class="autoFarmInput" data-key="autoFarm_sword" min="0" style="width:50px"></td></tr>
                <tr><td>🪓 Barbaros:</td><td><input type="number" class="autoFarmInput" data-key="autoFarm_axe" min="0" style="width:50px"></td></tr>
                <tr><td>🐎 Cavalaria Leve:</td><td><input type="number" class="autoFarmInput" data-key="autoFarm_light" min="0" style="width:50px"></td></tr>
                <tr><td>🕵️ SPY:</td><td><input type="number" class="autoFarmInput" data-key="autoFarm_spy" min="0" style="width:50px"></td></tr>
            </table>
            <br>
        `;

        // Delay configurável
        let delayDiv = document.createElement("div");
        delayDiv.style.marginBottom = "10px";
        delayDiv.innerHTML = `
            <div style="display:flex; align-items:center; gap:5px; font-size:13px;">
                <span>⏳ <b>Delay (s):</b></span>
                <input type="number" id="autoFarmDelay" min="1" style="width:80px;">
            </div>
        `;

        setTimeout(() => {
            troopDiv.querySelectorAll(".autoFarmInput").forEach(input => {
                input.value = localStorage.getItem(input.dataset.key) || "0";
                input.addEventListener("change", saveTroopConfig);
            });

            let delayInput = document.querySelector("#autoFarmDelay");
            delayInput.value = getDelay() / 1000; // mostra em segundos
            delayInput.addEventListener("change", () => {
                let seconds = parseInt(delayInput.value) || 1;
                localStorage.setItem("autoFarm_delay", seconds * 1000); // salva em ms
            });
        }, 100);

        let saveBtn = createButton("💾 Salvar Coordenadas", "#2196F3");
        saveBtn.addEventListener("click", saveCoords);

        let startBtn = createButton("▶️ Iniciar AutoFarm", "#4CAF50");
        startBtn.id = "autoFarmBtn";
        startBtn.addEventListener("click", toggleFarm);

        let resetBtn = createButton("♻️ Resetar Configuração", "#c0392b");
        resetBtn.addEventListener("click", resetConfig);

        let signature = document.createElement("div");
        signature.textContent = "by Gustavo M.S.";
        Object.assign(signature.style, {
            fontSize: "12px",
            marginTop: "6px",
            textAlign: "center",
            color: "#333",
            fontStyle: "italic"
        });

        popup.appendChild(closeBtn);
        popup.appendChild(title);
        popup.appendChild(troopDiv);
        popup.appendChild(delayDiv);
        popup.appendChild(saveBtn);
        popup.appendChild(startBtn);
        popup.appendChild(resetBtn);
        popup.appendChild(signature);
        document.body.appendChild(popup);

        makeDraggable(popup);

        if (localStorage.getItem("autoFarmRunning") === "1") {
            running = true;
            autoFarm();
        }
        updateButtonText();

        // Atalho para reabrir popup: tecla "P"
        document.addEventListener("keydown", (e) => {
            if (e.key.toLowerCase() === "p") popup.style.display = "block";
        });
    }

    function createButton(text, bg) {
        let btn = document.createElement("button");
        btn.textContent = text;
        Object.assign(btn.style, {
            display: "block",
            padding: "8px",
            marginBottom: "6px",
            width: "90%",
            background: bg,
            color: "white",
            fontWeight: "bold",
            border: "2px solid #333",
            cursor: "pointer",
            borderRadius: "6px",
            textAlign: "center"
        });
        return btn;
    }

    function makeDraggable(el) {
        let offsetX = 0, offsetY = 0, isDown = false;

        el.addEventListener("mousedown", e => {
            isDown = true;
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;
        });

        document.addEventListener("mouseup", () => isDown = false);

        document.addEventListener("mousemove", e => {
            if (!isDown) return;
            el.style.left = (e.clientX - offsetX) + "px";
            el.style.top = (e.clientY - offsetY) + "px";
        });
    }

    function saveCoords() {
        let textarea = document.querySelector("#barbCoordsScript");
        if (!textarea) return alert("⚠️ Vá até o BrbsFarmsFinder primeiro!");
        let newCoords = textarea.value.match(/\d+\|\d+/g) || [];
        if (!newCoords.length) return alert("⚠️ Nenhuma coordenada encontrada.");
        let currentCoords = JSON.parse(localStorage.getItem("autoFarmCoords") || "[]");
        if (currentCoords.length > 0 && confirm("Deseja ADICIONAR as novas coordenadas? (OK=Adicionar | Cancelar=Substituir)"))
            newCoords = [...currentCoords, ...newCoords];
        localStorage.setItem("autoFarmCoords", JSON.stringify(newCoords));
        alert("✅ Coordenadas salvas! Total: " + newCoords.length);
        updateButtonText();
    }

    function toggleFarm() {
        running = !running;
        localStorage.setItem("autoFarmRunning", running ? "1" : "0");
        if (running) autoFarm();
        updateButtonText();
    }

    function autoFarm() {
        if (!running) return;
        let coords = JSON.parse(localStorage.getItem("autoFarmCoords") || "[]");
        let troops = getTroopConfig();
        // Verifica se existe a mensagem de erro de unidades insuficientes
        let msgErro = document.querySelector(".error_box .content");
        if (msgErro && msgErro.textContent.includes("Não existem unidades suficientes")) {
            running = false;
            localStorage.setItem("autoFarmRunning", "0");
            updateButtonText();
            alert("⚠️ AutoFarm pausado: Não existem unidades suficientes!");
            return;
        }

        if (coords.length === 0) {
            alert("✅ Todas as coordenadas foram usadas!");
            running = false;
            localStorage.setItem("autoFarmRunning", "0");
            updateButtonText();
            return;
        }

        let confirmBtn = document.querySelector("#troop_confirm_submit");
        if (confirmBtn) {
            coords.shift();
            localStorage.setItem("autoFarmCoords", JSON.stringify(coords));

        setTimeout(() => {
            if (running && confirmBtn) confirmBtn.click(); // 🔹 agora clica no botão correto
        }, getDelay());

        return;
        }

        if (document.location.href.includes("screen=place")) {
            let [x, y] = coords[0].split("|");
            document.forms[0].x.value = x;
            document.forms[0].y.value = y;
            $("#place_target").find("input").val(coords[0]);   

        // Aguarda o código externo preencher (spy=1) e então sobrescreve
        setTimeout(() => {
            if (document.forms[0].spear) document.forms[0].spear.value = troops.spear > 0 ? troops.spear : "";
            if (document.forms[0].sword) document.forms[0].sword.value = troops.sword > 0 ? troops.sword : "";
            if (document.forms[0].axe) document.forms[0].axe.value = troops.axe > 0 ? troops.axe : "";
            if (document.forms[0].light) document.forms[0].light.value = troops.light > 0 ? troops.light : "";
            if (document.forms[0].spy) document.forms[0].spy.value = troops.spy > 0 ? troops.spy : "";
        }, 60); // 🔹 pequeno delay para garantir que sobrescreva

            let attackBtn = document.querySelector("#target_attack");
            if (attackBtn) {
                setTimeout(() => {if (running) attackBtn.click();}, getDelay());
            }
        }

        updateButtonText();
        if (running) {
            setTimeout(autoFarm, getDelay());
        }
    }

    createPopup();
})();
