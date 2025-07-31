javascript:(function(){
    $.getScript('https://higamy.github.io/TW/Scripts/Approved/FarmGodCopy.js', function(){

        function clickButtons(){
            let buttons = document.querySelectorAll('.farmGod_icon.farm_icon.farm_icon_a, .farmGod_icon.farm_icon.farm_icon_b');
            
            if(buttons.length === 0) return; // nada pra clicar

            buttons.forEach((el,i)=>{
                setTimeout(()=>{ 
                    if(document.body.contains(el)) el.click(); 
                }, i*600);
            });

            // Depois de clicar em todos, verifica se ainda sobrou algum
            setTimeout(()=>{
                let remaining = document.querySelectorAll('.farmGod_icon.farm_icon.farm_icon_a, .farmGod_icon.farm_icon.farm_icon_b');
                if(remaining.length > 0){
                    console.log("🔄 Alguns botões sobraram, tentando novamente...");
                    clickButtons(); // tenta de novo até acabar
                }
            }, (buttons.length*600) + 600); // espera todos cliques terminarem
        }

        // Espera a tabela aparecer antes de iniciar
        function waitForButtons(){
            let buttons = document.querySelectorAll('.farmGod_icon.farm_icon.farm_icon_a, .farmGod_icon.farm_icon.farm_icon_b');
            if(buttons.length > 0){
                clickButtons();
            } else {
                setTimeout(waitForButtons, 600);
            }
        }

        waitForButtons();
    });
})();
