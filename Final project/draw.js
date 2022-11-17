const ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
const stringName="YANKOVICH_BLOCKSBUILDER_SCORE";

massive = [];
widthProportion = 0;
heightProportion = 0;
colors = ["#888888", "#c6c6c6", "#eacdab"];
blockV = 2.5;
animationStatus = false;
gameStatus = true;
score = 0;
leaderBoard = [{"name":"test","score":"250"}, {"name":"test","score":"125"}];
username = "username";




function startGame(event){
    input = document.getElementById("playerName");
    let inputedPlayerName = input.value;
    if (inputedPlayerName.trim()== ""){
        flashAndFocus(input);
        return;
    }
    username = escape(input.value.trim());
    event.stopPropagation();
    for (let i = 1; i <massive.length; i++){
        massive[i].parentElement.removeChild(massive[i]);
    }
    massive = massive.slice(0,1);
    gameStatus = true;
    addBlock();
    let ot = document.getElementById("overlayText");
    ot.style.display = "none";
}

function flashAndFocus(input){
    input.style.backgroundColor = "#fca2c1";
    setTimeout(function()
    {
        input.style.backgroundColor = "white";
        setTimeout(function()
        {
            input.style.backgroundColor = "#fca2c1";
            setTimeout(function()
            {
                input.style.backgroundColor = "white";
                setTimeout(function()
                {
                    input.style.backgroundColor = "#fca2c1";
                    setTimeout(function()
                    {
                        input.style.backgroundColor = "white";
                        input.focus();
                    }, 150);
                }, 150);
            }, 150);
        }, 150);
    }, 150);
}

function initPositionDonor(resize = false){
    let pf = document.getElementById("play_field");
    let pf_height = pf.offsetHeight;
    let pf_width = pf.offsetWidth;
    let ot = document.getElementById("overlayText");
    ot.style.height = pf_height+"px";
    ot.style.width = pf_width+"px";
    let rect = document.getElementById("donorRect");
    let rectHeight = Math.round(pf_height*0.04);
    let rectWidth = Math.round(pf_width*0.3);
    if (resize){
        widthProportion = parseFloat(rect.style.width)/rectWidth;
        heightProportion = parseFloat(rect.style.height)/rectHeight; 
    }
    rect.style.width = rectWidth;
    rect.style.height = rectHeight;
    let rect_x = (pf_width - rectWidth)/2;
    let rect_y = pf_height - rectHeight;
    let svg = document.getElementById("donor");
    if (!resize){
        massive.push(svg);
    }
    svg.style.top = rect_y;
    svg.style.left = rect_x; 
    svg.style.display = "block";
    svg.style.width = rectWidth;
    svg.style.height = rectHeight;
}

function addBlock(){
    let donor = massive.at(-1); 
    newBlock = donor.cloneNode(true);
    newBlock.id = "block" + massive.length;
    let rect = newBlock.getElementsByTagName("rect")[0];
    rect.id = "rect" + massive.length;
    rect.setAttribute("fill", colors[massive.length%colors.length])
    massive.push(newBlock);
    donor.parentElement.appendChild(newBlock);
    newBlock.style.top = parseFloat(newBlock.style.top) - 2*parseFloat(newBlock.style.height);
    //newBlock.style.left = parseFloat(newBlock.style.left) + 20;
    newBlock.style.left = 0;
    animationStatus = true;
    requestAnimationFrame(tick);
}

function adaptBlocks(){
    let pf = document.getElementById("play_field");
    let pf_height = pf.offsetHeight;
    let pf_width = pf.offsetWidth;
    for (let i = 1; i <massive.length; i++){
        massive[i].style.width = parseFloat(massive[i].style.width)/widthProportion;
        massive[i].style.height = parseFloat(massive[i].style.height)/heightProportion;
        let rectaingle = massive[i].getElementById("rect" + i);
        rectaingle.style.width = parseFloat(massive[i].style.width)/widthProportion;
        rectaingle.style.height = parseFloat(massive[i].style.height)/heightProportion;
        massive[i].style.top = parseFloat(massive[i-1].style.top)-2*parseFloat(massive[i].style.height);
        //massive[i].style.top = parseFloat(massive[i].style.top)/heightProportion;
        massive[i].style.left = parseFloat(massive[i].style.left)/widthProportion;
    }
}

function tick() {
    if (!animationStatus){
        cropBlock();
        if (gameStatus){
            addBlock();
        }
        return;
    }
    let pf = document.getElementById("play_field");
    let pfWidth = pf.offsetWidth;
    let activeBlock = massive.at(-1);
    let activeBlockWidth = parseFloat(activeBlock.style.width);
    let activeBlocLeft = parseFloat(activeBlock.style.left);

    // вылетел ли мяч правее стены?
    if ((activeBlocLeft + blockV + activeBlockWidth)>=pfWidth){
        blockV = -blockV;
        activeBlock.style.left = (pfWidth - activeBlockWidth)+"px";
    }

    // activeBlock.posX+=activeBlock.speedX;
    
    // вылетел ли мяч левее стены?
    if ((activeBlocLeft + blockV)<0){
        blockV = -blockV;
        activeBlock.style.left = "0px";
    }
    
    activeBlock.style.left = activeBlocLeft+blockV;
    if (animationStatus){
        requestAnimationFrame(tick);
    }
    else{
        cropBlock();
        if (gameStatus){
            addBlock();
        }
    } 
}

function stopTick(){
    animationStatus = false;
}

function stopGame(){
    gameStatus = false;
    let ot = document.getElementById("overlayText");
    ot.style.display = "block";
    let un = document.getElementById("userName");
    un.style.display = "block";

    getScores();
    sendScores();
}

function cropBlock(){
    let init_left = parseFloat(massive.at(-2).style.left);
    let init_width = parseFloat(massive.at(-2).style.width);
    let block = massive.at(-1);
    let current_left = parseFloat(block.style.left);
    let current_width = parseFloat(block.style.width);
    if (current_left+current_width <= init_left || current_left>= init_left+init_width){
        stopTick();
        stopGame();
        return;
    }
    let ratio = 0;
    if (current_left > init_left){
        let newWidth = parseFloat(block.style.width)+(init_left-current_left);
        if (newWidth<1){
            newWidth+=1;
        }
        block.style.width = newWidth;
        ratio = (parseFloat(block.style.width)+(init_left-current_left))/init_width;

    }
    if (init_left > current_left){
        let newWidth = parseFloat(block.style.width)-(init_left-current_left);
        if (newWidth<1){
            newWidth+=1;
        }
        block.style.width = newWidth;
        block.style.left = parseFloat(block.style.left)+(init_left-current_left);
        ratio = (parseFloat(block.style.width)-(init_left-current_left))/init_width;
    }
    if(ratio<0){
        ratio = 1 + ratio;
    }
    console.log(ratio);
    score+= Math.round(50*ratio*massive.length);
    document.getElementById("currentScore").innerText = score;
}

function escape(text) {
    if ( !text )
        return text;
    return text.toString()
        .split("&").join("&amp;")
        .split("<").join("&lt;")
        .split(">").join("&gt;")
        .split('"').join("&quot;")
        .split("'").join("&#039;");
}

function getScores() {
    $.ajax( {
            url : ajaxHandlerScript,
            type : 'POST', dataType:'json',
            data : { f : 'READ', n : stringName },
            cache : false,
            success : showScores,
            error : errorHandler
        }
    );
}

function showScores(data) {
    if ( data.error!=undefined )
        alert(data.error);
    else {
        if ( data.result!="" ) { 
            leaderBoard=JSON.parse(data.result);
            updateLeaderBoard();
        }
    }
}

function updateLeaderBoard(){
    document.getElementById("leaderboard").innerText = JSON.stringify(leaderBoard);
}

function sendScores() {
    updatePassword=Math.random();
    $.ajax( {
            url : ajaxHandlerScript,
            type : 'POST', dataType:'json',
            data : { f : 'LOCKGET', n : stringName,
                p : updatePassword },
            cache : false,
            success : lockGetReady,
            error : errorHandler
        }
    );
}

// сообщения получены, добавляет, показывает, сохраняет
function lockGetReady(data) {
    if ( data.error!=undefined )
        alert(data.error);
    else {
        if ( data.result!="" ) { 
            leaderBoard=JSON.parse(data.result);
        }

        //push to a new array then slice
        let new_scores = []
        let new_count = leaderBoard.length < 3 ? leaderBoard.length + 1 : 3;
        let push = true;
        leaderBoard.forEach(element => {
            alert(JSON.stringify(element))
            if (score >= parseInt(element.score) && push){
                new_scores.push({"name":username,"score":score.toString()});
                push = !push;
            }
            new_scores.push(element);
        });
        if (push){
            new_scores.push({"name":username,"score":score.toString()});
        }
        leaderBoard = new_scores.slice(0, new_count);
        
        $.ajax( {
                url : ajaxHandlerScript,
                type : 'POST', dataType:'json',
                data : { f : 'UPDATE', n : stringName,
                    v : JSON.stringify(leaderBoard), p : updatePassword },
                cache : false,
                success : updateReady,
                error : errorHandler
            }
        );
    }
}

function updateReady(data) {
    if ( data.error!=undefined )
        alert(data.error);
    updateLeaderBoard();
}

function errorHandler(jqXHR,statusStr,errorStr) {
    alert(statusStr+' '+errorStr);
}

// $.ajax( {
//     url : ajaxHandlerScript,
//     type : 'POST', dataType:'json',
//     data : { f : 'INSERT', n : stringName,
//         v : JSON.stringify(leaderBoard)},
//     cache : false
// }
// );