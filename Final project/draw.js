
class Block {

    id;
    element;
    top;
    left;
    width;
    height;

    update(){
        this.element.id = this.id;
        this.element.style.top = this.top;
        this.element.style.left = this.left;
        this.element.style.width = this.width;
        this.element.style.height = this.height;
    }

    adapt(widthProportion, heightProportion, prevTop, count){
        this.width = parseFloat(this.width)/widthProportion;
        this.height = parseFloat(this.height)/heightProportion;
        this.top = parseFloat(prevTop)-2*parseFloat(this.height);
        this.left = parseFloat(this.left)/widthProportion;
        this.update();

        let rectangle = this.element.getElementById("rect" + count);
        rectangle.style.width = parseFloat(this.width)/widthProportion;
        rectangle.style.height = parseFloat(this.height)/heightProportion;
    }

    move(containerWidth, game) {
        let width = parseFloat(this.width);
        let left = parseFloat(this.left);

        if ((left + game.get_blockVelocity() + width)>=containerWidth){
            game.reverse_blockVelocity();
            this.left = (containerWidth - width)+"px";
        }

        if ((left + game.get_blockVelocity())<0){
            game.reverse_blockVelocity();
            this.left = "0px";
        }
        
        this.left = left+game.get_blockVelocity();
        this.update();
    }

    crop(init_left, init_width){
        let current_left = parseFloat(this.left);
        let current_width = parseFloat(this.width);
        if (current_left+current_width <= init_left || current_left>= init_left+init_width){
            stopTick();
            stopGame();
            return;
        }
        let ratio = 0;
        if (current_left > init_left){
            let newWidth = current_width+(init_left-current_left);
            if (newWidth<1){
                newWidth+=1;
            }
            this.width = newWidth;
            ratio = (this.width+(init_left-current_left))/init_width;
            this.update();
        }
        if (init_left > current_left){
            let newWidth = current_width-(init_left-current_left);
            if (newWidth<1){
                newWidth+=1;
            }
            this.width = newWidth;
            this.left = current_left+(init_left-current_left);
            ratio = (this.width-(init_left-this.left))/init_width;
            this.update();
        }
        return ratio;
    }

    propagate_element(){
        this.element = document.getElementById(this.id);
    }

    propagate_params(){
        this.id = this.element.id;
        this.top = this.element.style.top;
        this.left = this.element.style.left;
        this.width = this.element.style.width;
        this.height = this.element.style.height;
    }

    init_rect(count, color){
        let rect = this.element.getElementsByTagName("rect")[0];
        rect.id = "rect" +count;
        rect.setAttribute("fill", color);
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

    flashAndFocus(input, colors, fnf=null, period=150, count=4){

        if (fnf == null)
            fnf = this.flashAndFocus;

        setTimeout(
            function()
            {
                input.style.backgroundColor = colors[(count%2)];
                if (count > 1){
                    fnf(input, colors, fnf, period, count-1);
                }
                else {
                    input.focus();
                }
            }, 
            period
        );

    }


}

let game = new Game();
let helper = new MrkpHlpr()

function startGame(event){

    event = event || window.event;
    event.stopPropagation();

    game.set_score()
    document.getElementById("currentScore").innerText = "0";
    input = document.getElementById("playerName");
    let inputedPlayerName = input.value;
    if (inputedPlayerName.trim()== ""){
        helper.flashAndFocus(input, ['#fca2c1', 'white']);
        return;
    }
    if (inputedPlayerName.length > 15){
        helper.toggle_element(document.getElementById("warning"), false);
        helper.flashAndFocus(input, ['#fca2c1', 'white']);
        return;
    }
    helper.toggle_element(document.getElementById("warning"));
    game.set_username(escape(input.value.trim()));
    
    for (let i = 1; i <game.blocks.length; i++){
        game.blocks[i].element.parentElement.removeChild(game.blocks[i].element);
    }
    game.blocks = game.blocks.slice(0,1);
    game.set_gameStatus(true);
    addBlock();
    let ot = document.getElementById("overlayText");
    helper.toggle_element(ot);
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
    let block = new Block();
    block.id = "donor";
    block.propagate_element();
    helper.toggle_element(block.element, false);
    block.top = rect_y;
    block.left = rect_x;
    block.width = rectWidth;
    block.height = rectHeight;
    block.update();
    if (!resize){
        game.blocks.push(block);
    }
}

function addBlock(){
    if (game.blocks.length == 24){
        stopTick();
        stopGame();
        return;
    }
    let donor = game.blocks.at(-1); 
    let newBlock = new Block();
    newBlock.element = donor.element.cloneNode(true);
    newBlock.id = "block" + game.blocks.length;
    newBlock.init_rect(game.blocks.length, game.get_colors()[game.blocks.length%game.get_colors().length])

    game.blocks.push(newBlock);
    donor.element.parentElement.appendChild(newBlock.element);
    newBlock.propagate_params()
    newBlock.top = parseFloat(newBlock.top) - 2*parseFloat(newBlock.height);
    newBlock.left = 0;
    newBlock.update();
    game.set_animationStatus(true);
    requestAnimationFrame(tick);
}

function adaptBlocks(){
    for (let i = 1; i <game.blocks.length; i++){
        let wp = game.get_widthProportion(); 
        let hp = game.get_heightProportion();
        game.blocks[i].adapt(wp, hp, game.blocks[i-1].element.style.top, i);
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
    activeBlock.move(pfWidth, game);
    
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
    helper.toggle_element(document.getElementById("overlayText"), false);
    helper.toggle_element(document.getElementById("userName"), false)
    helper.toggle_element(document.getElementById("gameOver"), false)
    getScores();
    sendScores();
}

function cropBlock(){
    let init_left = parseFloat(game.blocks.at(-2).left);
    let init_width = parseFloat(game.blocks.at(-2).width);
    let block = game.blocks.at(-1);
    let current_left = parseFloat(block.left);
    let current_width = parseFloat(block.width);
    if (current_left+current_width <= init_left || current_left>= init_left+init_width){
        stopTick();
        stopGame();
        return;
    }
    let ratio = block.crop(init_left, init_width);
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
            game.leaderBoard=JSON.parse(data.result);
            updateLeaderBoard();
        }
    }
}

function updateLeaderBoard(){
    for (let i=1; i<=3; i++){
        if (game.leaderBoard.length >= i && game.leaderBoard[i-1].score>0){
            document.getElementById("leaderboard" + i).innerText = game.leaderBoard[i-1].name + ": " + game.leaderBoard[i-1].score;
        }
        else {
            document.getElementById("leaderboard" + i).innerText = "---"
        }
    }
    document.getElementById("currentRecord").innerText = game.leaderBoard.length >= 0 ? game.leaderBoard[0].score : "---";
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

function lockGetReady(data) {
    if ( data.error!=undefined )
        alert(data.error);
    else {
        if ( data.result!="" ) { 
            game.leaderBoard=JSON.parse(data.result);
        }

        //push to a new array then slice
        let new_scores = []
        let new_count = game.leaderBoard.length < 3 ? game.leaderBoard.length + 1 : 3;
        let push = true;
        game.leaderBoard.forEach(element => {
            if (game.get_score() >= parseInt(element.score) && push){
                new_scores.push({"name":game.get_username(),"score":game.get_score().toString()});
                push = !push;
            }
            new_scores.push(element);
        });
        if (push){
            new_scores.push({"name":game.get_username(),"score":game.get_score().toString()});
        }
        game.leaderBoard = new_scores.slice(0, new_count);
        
        $.ajax( {
                url : game.get_ajaxHandlerScript(),
                type : 'POST', dataType:'json',
                data : { f : 'UPDATE', n : game.get_containerName(),
                    v : JSON.stringify(game.leaderBoard), p : updatePassword },
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