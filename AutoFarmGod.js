javascript:(function(){
    $.getScript('https://higamy.github.io/TW/Scripts/Approved/FarmGodCopy.js', function(){

        function clickButtons(){
            // 🔹 Verificação de proteção contra bot
            let botButton = document.querySelector("a.btn.btn-default");
            if (botButton && botButton.textContent.includes("Iniciar a verificação da proteção do bot")) {
                console.log("⚠️ Proteção de bot detectada. Iniciando verificação...");
                botButton.click(); // Clica no botão

                setTimeout(() => {
                    let check = document.querySelector("#checkbox");
                    if (check) {
                        check.click(); // Marca o checkbox
                        console.log("✅ Checkbox da proteção marcado.");
                    }
                }, 6000); // Aguarda 6s para o checkbox aparecer
                return; // Para o processo até resolver a verificação
            }

            let buttons = document.querySelectorAll('.farmGod_icon.farm_icon.farm_icon_a, .farmGod_icon.farm_icon.farm_icon_b');
            
            if(buttons.length === 0) return; // nada pra clicar

            buttons.forEach((el,i)=>{
                setTimeout(()=>{ 
                    if(document.body.contains(el)) el.click(); 
                }, i*300);
            });

            // Depois de clicar em todos, verifica se ainda sobrou algum
            setTimeout(()=>{
                let remaining = document.querySelectorAll('.farmGod_icon.farm_icon.farm_icon_a, .farmGod_icon.farm_icon.farm_icon_b');
                if(remaining.length > 0){
                    console.log("🔄 Alguns botões sobraram, tentando novamente...");
                    clickButtons(); // tenta de novo até acabar
                }
            }, (buttons.length*300) + 300); // espera todos cliques terminarem
        }

        // Espera a tabela aparecer antes de iniciar
        function waitForButtons(){
            let buttons = document.querySelectorAll('.farmGod_icon.farm_icon.farm_icon_a, .farmGod_icon.farm_icon.farm_icon_b');
            if(buttons.length > 0){
                clickButtons();
            } else {
                setTimeout(waitForButtons, 700);
            }
        }

        waitForButtons();
    });
})();
