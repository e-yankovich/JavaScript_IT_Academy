
class Block {

    id;
    element;
    top;
    left;
    width;
    height;

    update(){
        this.element.id = this.id;
        this.elemen.style.top = this.top;
        this.element.style.left = this.left;
        this.element.style.width = this.width;
        this.elemen.style.height = this.height;
    }
}

class Game{

    blocks = [];
    leaderBoard = [];
    #widthProportion = 0;
    #heightProportion = 0;
    #colors = ["#888888", "#c6c6c6", "#eacdab"];
    #blockVelocity = 2.5;
    #animationStatus = false;
    #gameStatus = true;
    #score = 0;
    #username = "";
    #ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
    #containerName="YANKOVICH_BLOCKSBUILDER_SCORE";

    get_widthProportion(){
        return this.#widthProportion;
    }

    set_widthProportion(widthProportion){
        this.#widthProportion = widthProportion;
    }

    get_heightProportion(){
        return this.#heightProportion;
    }

    set_heightProportion(heightProportion){
        this.#heightProportion = heightProportion;
    }

    get_colors(){
        return this.#colors;
    }

    get_blockVelocity(){
        return this.#blockVelocity;
    }

    reverse_blockVelocity(){
        this.#blockVelocity = -this.#blockVelocity;
    }

    get_animationStatus(){
        return this.#animationStatus;
    }

    set_animationStatus(animationStatus){
        this.#animationStatus = animationStatus;
    }

    get_gameStatus(){
        return this.#gameStatus;
    }

    set_gameStatus(gameStatus){
        this.#gameStatus = gameStatus;
    }

    get_score(){
        return this.#score;
    }

    set_score(score=0){
        this.#score = score;
    }

    update_score(ratio){
        this.#score += Math.round(50*ratio*this.blocks.length)
    }

    get_username(){
        return this.#username;
    }

    set_username(username){
        this.#username = username;
    }

    get_ajaxHandlerScript(){
        return this.#ajaxHandlerScript;
    }

    get_containerName(){
        return this.#containerName;
    }

}

class MrkpHlpr {

    toggle_element(element, hide = true){
        if (hide){
            element.style.display = "none";
        }
        else {
            element.style.display = "block";
        }
    }
}

let game = new Game();
let helper = new MrkpHlpr()

function startGame(event){
    game.set_score()
    document.getElementById("currentScore").innerText = "0";
    input = document.getElementById("playerName");
    let inputedPlayerName = input.value;
    if (inputedPlayerName.trim()== ""){
        flashAndFocus(input);
        return;
    }
    game.set_username(escape(input.value.trim()));
    event.stopPropagation();
    for (let i = 1; i <game.blocks.length; i++){
        game.blocks[i].parentElement.removeChild(game.blocks[i]);
    }
    game.blocks = game.blocks.slice(0,1);
    game.set_gameStatus(true);
    addBlock();
    let ot = document.getElementById("overlayText");
    helper.toggle_element(ot);
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
        game.set_widthProportion(parseFloat(rect.style.width)/rectWidth);
        game.set_heightProportion(parseFloat(rect.style.height)/rectHeight); 
    }
    rect.style.width = rectWidth;
    rect.style.height = rectHeight;
    let rect_x = (pf_width - rectWidth)/2;
    let rect_y = pf_height - rectHeight;
    let svg = document.getElementById("donor");
    if (!resize){
        game.blocks.push(svg);
    }
    svg.style.top = rect_y;
    svg.style.left = rect_x; 
    svg.style.display = "block";
    svg.style.width = rectWidth;
    svg.style.height = rectHeight;
}

function addBlock(){
    let donor = game.blocks.at(-1); 
    newBlock = donor.cloneNode(true);
    newBlock.id = "block" + game.blocks.length;
    let rect = newBlock.getElementsByTagName("rect")[0];
    rect.id = "rect" + game.blocks.length;
    rect.setAttribute("fill", game.get_colors()[game.blocks.length%game.get_colors().length])
    game.blocks.push(newBlock);
    donor.parentElement.appendChild(newBlock);
    newBlock.style.top = parseFloat(newBlock.style.top) - 2*parseFloat(newBlock.style.height);
    //newBlock.style.left = parseFloat(newBlock.style.left) + 20;
    newBlock.style.left = 0;
    game.set_animationStatus(true);
    requestAnimationFrame(tick);
}

function adaptBlocks(){
    let pf = document.getElementById("play_field");
    let pf_height = pf.offsetHeight;
    let pf_width = pf.offsetWidth;
    for (let i = 1; i <game.blocks.length; i++){
        game.blocks[i].style.width = parseFloat(game.blocks[i].style.width)/game.get_widthProportion();
        game.blocks[i].style.height = parseFloat(game.blocks[i].style.height)/game.get_heightProportion();
        let rectaingle = game.blocks[i].getElementById("rect" + i);
        rectaingle.style.width = parseFloat(game.blocks[i].style.width)/game.get_widthProportion();
        rectaingle.style.height = parseFloat(game.blocks[i].style.height)/game.get_heightProportion();
        game.blocks[i].style.top = parseFloat(game.blocks[i-1].style.top)-2*parseFloat(game.blocks[i].style.height);
        //game.blocks[i].style.top = parseFloat(game.blocks[i].style.top)/game.get_heightProportion();
        game.blocks[i].style.left = parseFloat(game.blocks[i].style.left)/game.get_widthProportion();
    }
}

function tick() {
    if (!game.get_animationStatus()){
        cropBlock();
        if (game.get_gameStatus()){
            addBlock();
        }
        return;
    }
    let pf = document.getElementById("play_field");
    let pfWidth = pf.offsetWidth;
    let activeBlock = game.blocks.at(-1);
    let activeBlockWidth = parseFloat(activeBlock.style.width);
    let activeBlocLeft = parseFloat(activeBlock.style.left);

    if ((activeBlocLeft + game.get_blockVelocity() + activeBlockWidth)>=pfWidth){
        game.reverse_blockVelocity();
        activeBlock.style.left = (pfWidth - activeBlockWidth)+"px";
    }

    if ((activeBlocLeft + game.get_blockVelocity())<0){
        game.reverse_blockVelocity();
        activeBlock.style.left = "0px";
    }
    
    activeBlock.style.left = activeBlocLeft+game.get_blockVelocity();
    if (game.get_animationStatus()){
        requestAnimationFrame(tick);
    }
    else{
        cropBlock();
        if (game.get_gameStatus()){
            addBlock();
        }
    } 
}

function stopTick(){
    game.set_animationStatus(false);
}

function stopGame(){
    game.set_gameStatus(false);
    let ot = document.getElementById("overlayText");
    helper.toggle_element(ot, false)
    let un = document.getElementById("userName");
    un.style.display = "block";

    getScores();
    sendScores();
}

function cropBlock(){
    let init_left = parseFloat(game.blocks.at(-2).style.left);
    let init_width = parseFloat(game.blocks.at(-2).style.width);
    let block = game.blocks.at(-1);
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
    game.update_score(ratio);
    document.getElementById("currentScore").innerText = game.get_score();
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
            url : game.get_ajaxHandlerScript(),
            type : 'POST', dataType:'json',
            data : { f : 'READ', n : game.get_containerName() },
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
            url : game.get_ajaxHandlerScript(),
            type : 'POST', dataType:'json',
            data : { f : 'LOCKGET', n : game.get_containerName(),
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
            if (game.get_score() >= parseInt(element.score) && push){
                new_scores.push({"name":game.get_username(),"score":game.get_score().toString()});
                push = !push;
            }
            new_scores.push(element);
        });
        if (push){
            new_scores.push({"name":game.get_username(),"score":game.get_score().toString()});
        }
        leaderBoard = new_scores.slice(0, new_count);
        
        $.ajax( {
                url : game.get_ajaxHandlerScript(),
                type : 'POST', dataType:'json',
                data : { f : 'UPDATE', n : game.get_containerName(),
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