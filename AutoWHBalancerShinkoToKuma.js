javascript:(function(){
    $.getScript("https://shinko-to-kuma.com/scripts/WHBalancerShinkoToKuma.js", function(){

        // Cria o botão na tela
        let startBtn = document.createElement("button");
        startBtn.textContent = "Iniciar AutoClick";
        startBtn.style.position = "fixed";
        startBtn.style.top = "100px";
        startBtn.style.left = "100px";
        startBtn.style.zIndex = "9999";
        startBtn.style.padding = "10px";
        startBtn.style.background = "#4CAF50";
        startBtn.style.color = "white";
        startBtn.style.fontWeight = "bold";
        startBtn.style.border = "2px solid #333";
        startBtn.style.cursor = "pointer";
        startBtn.style.borderRadius = "6px";

        document.body.appendChild(startBtn);

        function autoClick(){
            let buttons = document.querySelectorAll('input.btnSophie#building');
            if(buttons.length > 0){
                buttons.forEach((el,i)=>{
                    setTimeout(()=>{el.click();}, i*700);
                });
            } 
            setTimeout(autoClick, 300); // continua rodando sempre
        }

        // Só inicia quando clicar no botão
        startBtn.addEventListener("click", function(){
            autoClick();
            startBtn.remove(); // remove o botão da tela depois de iniciar
        });

    });
})();
