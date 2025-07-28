javascript:(function(){
    $.getScript('https://higamy.github.io/TW/Scripts/Approved/FarmGodCopy.js', function(){
        function waitForButtons(){
            let buttons = document.querySelectorAll('.farmGod_icon.farm_icon.farm_icon_a, .farmGod_icon.farm_icon.farm_icon_b');
            if(buttons.length > 0){
                buttons.forEach((el,i)=>{
                    setTimeout(()=>{el.click();}, i*600);
                });
            } else {
                setTimeout(waitForButtons, 300); // tenta de novo até aparecer
            }
        }
        waitForButtons();
    });
})();
