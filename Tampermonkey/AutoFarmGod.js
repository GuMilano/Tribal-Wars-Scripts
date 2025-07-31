// ==UserScript==
// @name         AutoFarmGod (UI Melhorada + Mensagens na Tela + Movível)
// @namespace    http://tampermonkey.net/
// @version      6.2
// @description  AutoFarmGod com mensagens visuais, proteção contra bot, auto-plan farms e popup arrastável
// @match        *://*.tribalwars.com.br/game.php*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    let running = false;
    let firstRun = localStorage.getItem("autoFarmGodFirstRun") !== "0";
    let msgBox;

    function showMessage(text, color = "#333") {
        if (!msgBox) return;
        msgBox.textContent = text;
        msgBox.style.color = color;
    }

    function checkFarmError() {
        let errorBox = document.querySelector(".error_box");
        if (errorBox && errorBox.textContent.includes("farm not send")) {
            showMessage("⚠️ Erro detectado! Fazendo verificação de bot...", "red");
            running = false;
            localStorage.setItem("autoFarmGodRunning", "0");

            let botButton = Array.from(document.querySelectorAll("a.btn.btn-default"))
                .find(el => el.textContent.trim().includes("Iniciar a verificação da proteção do bot"));

            if (botButton) {
                botButton.click();
                setTimeout(() => {
                    let check = document.querySelector("#checkbox");
                    if (check) {
                        check.click();
                        showMessage("✅ Bot verificado! Retomando...", "green");
                        setTimeout(() => toggleFarmGod(), 2000);
                    } else {
                        showMessage("❌ Checkbox não encontrado! Script pausado.", "red");
                    }
                }, 2000);
            }
        }
    }

    function startFarmGod() {
        if (!running) return;

        $.getScript("https://higamy.github.io/TW/Scripts/Approved/FarmGodCopy.js", function () {
            showMessage("✅ FarmGod carregado! Iniciando cliques...", "green");
            waitForButtons();
            monitorFarmProgress();
        });
    }

    function executeFarmGod() {
        if (!running) return;

        let botButton = Array.from(document.querySelectorAll("a.btn.btn-default"))
            .find(el => el.textContent.trim().includes("Iniciar a verificação da proteção do bot"));

        if (botButton) {
            showMessage("⚠️ Proteção de bot detectada! Verificando...", "orange");
            botButton.click();

            setTimeout(() => {
                let check = document.querySelector("#checkbox");
                if (check) {
                    check.click();
                    showMessage("✅ Checkbox marcado! Continuando...", "green");
                }
            }, 1500);

            setTimeout(executeFarmGod, 3000);
            return;
        }

        startFarmGod();
    }

    function waitForButtons() {
        if (!running) return;

        checkFarmError();

        let buttons = document.querySelectorAll(".farmGod_icon.farm_icon.farm_icon_a, .farmGod_icon.farm_icon.farm_icon_b");

        if (buttons.length > 0) {
            showMessage(`▶️ Encontrados ${buttons.length} botões. Clicando...`, "#0066cc");
            buttons.forEach((el, i) => {
                setTimeout(() => { if (running) el.click(); }, i * 600);
            });

            setTimeout(waitForButtons, buttons.length * 600 + 3000);
        } else {
            setTimeout(waitForButtons, 1000);
        }
    }

    function monitorFarmProgress() {
        let checkInterval = setInterval(() => {
            if (!running) {
                clearInterval(checkInterval);
                return;
            }

            checkFarmError();

            let label = document.querySelector(".label");
            if (!label) return;

            let match = label.textContent.match(/(\d+)\s*\/\s*(\d+)/);
            if (match) {
                let current = parseInt(match[1]);
                let total = parseInt(match[2]);

                if (current >= total) {
                    clearInterval(checkInterval);
                    showMessage("✅ FarmGod finalizado! Recarregando em 15 minutos...", "green");

                    setTimeout(() => {
                        if (running) {
                            firstRun = false;
                            localStorage.setItem("autoFarmGodFirstRun", "0");
                            location.reload();
                        }
                    }, 900000);
                }
            }
        }, 2000);
    }

    function monitorPlanFarms() {
        setInterval(() => {
            if (!running || firstRun) return;

            let planBtn = document.querySelector('input.btn.optionButton[value="Plan farms"]');
            if (planBtn) {
                showMessage("⚡ Botão 'Plan farms' encontrado! Clicando...", "#009933");
                planBtn.click();
            }
        }, 1500);
    }

    function toggleFarmGod() {
        running = !running;
        localStorage.setItem("autoFarmGodRunning", running ? "1" : "0");

        let btn = document.getElementById("farmGodBtn");
        if (btn) btn.textContent = running ? "⏸️ Parar AutoFarmGod" : "▶️ Iniciar AutoFarmGod";

        if (running) {
            localStorage.setItem("autoFarmGodFirstRun", "1");
            firstRun = true;
            executeFarmGod();
            monitorPlanFarms();
        } else {
            showMessage("⏸️ AutoFarmGod pausado", "orange");
        }
    }

    function makeDraggable(el) {
        let offsetX = 0, offsetY = 0, isDown = false;

        el.addEventListener("mousedown", e => {
            if (e.target.tagName === "BUTTON") return; // Evita mover ao clicar no botão
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

    function createPopup() {
        if (document.getElementById("farmGodPopup")) return;

        let popup = document.createElement("div");
        popup.id = "farmGodPopup";
        Object.assign(popup.style, {
            position: "fixed",
            top: "100px",
            left: "20px",
            background: "#f4e4bc",
            border: "3px solid #804000",
            borderRadius: "10px",
            padding: "10px",
            zIndex: "9999",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            fontFamily: "Verdana, sans-serif",
            textAlign: "center",
            cursor: "move"
        });

        let title = document.createElement("div");
        title.textContent = "⚡ AutoFarmGod";
        Object.assign(title.style, {
            fontWeight: "bold",
            fontSize: "16px",
            marginBottom: "8px",
            color: "#5a2d00"
        });

        let btn = document.createElement("button");
        btn.id = "farmGodBtn";
        btn.textContent = "▶️ Iniciar AutoFarmGod";
        Object.assign(btn.style, {
            display: "block",
            padding: "8px",
            marginBottom: "6px",
            width: "90%",
            background: "#4CAF50",
            color: "white",
            fontWeight: "bold",
            border: "2px solid #333",
            cursor: "pointer",
            borderRadius: "6px",
            margin: "0 auto"
        });

        btn.addEventListener("click", toggleFarmGod);

        msgBox = document.createElement("div");
        msgBox.style.fontSize = "13px";
        msgBox.style.marginTop = "6px";
        msgBox.style.minHeight = "18px";

        let footer = document.createElement("div");
        footer.textContent = "by Gustavo M.S.";
        Object.assign(footer.style, {
            fontSize: "12px",
            marginTop: "6px",
            color: "#333",
            fontStyle: "italic"
        });

        popup.appendChild(title);
        popup.appendChild(btn);
        popup.appendChild(msgBox);
        popup.appendChild(footer);
        document.body.appendChild(popup);

        makeDraggable(popup);
    }

    createPopup();

    window.addEventListener("load", () => {
        if (localStorage.getItem("autoFarmGodRunning") === "1") {
            running = true;
            firstRun = localStorage.getItem("autoFarmGodFirstRun") !== "0";

            setTimeout(() => {
                let btn = document.getElementById("farmGodBtn");
                if (btn) btn.textContent = "⏸️ Parar AutoFarmGod";

                showMessage("🔄 AutoFarmGod reiniciado...", "#0066cc");
                executeFarmGod();
                monitorPlanFarms();
            }, 2000);
        }
    });
})();
