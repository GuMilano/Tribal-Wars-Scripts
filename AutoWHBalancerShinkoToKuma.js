javascript:(function(){
    $.getScript("https://shinko-to-kuma.com/scripts/WHBalancerShinkoToKuma.js", function(){
        function waitForButtons(){
            let buttons = document.querySelectorAll('input.btnSophie#building');
            if(buttons.length > 0){
                buttons.forEach((el,i)=>{
                    setTimeout(()=>{el.click();}, i*700);
                });
            } else {
                setTimeout(waitForButtons, 300); // tenta de novo até aparecer
            }
        }
        waitForButtons();
    });
})();
