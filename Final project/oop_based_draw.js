const ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
const stringName="YANKOVICH_BLOCKSBUILDER_SCORE";

class Game{

    #blocks = [];
    #widthProportion = 0;
    #heightProportion = 0;
    #colors = ["#888888", "#c6c6c6", "#eacdab"];
    #blockVelocity = 2.5;
    #animationStatus = false;
    #gameStatus = true;
    #score = 0;
    leaderBoard = [];
    #username = "";
    #updatePassword = 0;

    startGame(event){
        let input = document.getElementById("playerName");
        let inputedPlayerName = input.value;
        if (inputedPlayerName.trim()== ""){
            this.#flashAndFocus(input);
            return;
        }
        event.stopPropagation();
        this.#score = 0;
        document.getElementById("currentScore").innerText = "0";
        this.#username = escape(input.value.trim());
        for (let i = 1; i < this.#blocks.length; i++){
            this.#blocks[i].parentElement.removeChild(this.#blocks[i]);
        }
        this.#blocks = this.#blocks.slice(0,1);
        this.#gameStatus = true;
        let ot = document.getElementById("overlayText");
        ot.style.display = "none";
        this.#addBlock();
    }

    initPositionDonor(resize = false){
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
            this.#widthProportion = parseFloat(rect.style.width)/rectWidth;
            this.#heightProportion = parseFloat(rect.style.height)/rectHeight; 
        }
        rect.style.width = rectWidth;
        rect.style.height = rectHeight;
        let rect_x = (pf_width - rectWidth)/2;
        let rect_y = pf_height - rectHeight;
        let svg = document.getElementById("donor");
        if (!resize){
            this.#blocks.push(svg);
        }
        svg.style.top = rect_y;
        svg.style.left = rect_x; 
        svg.style.display = "block";
        svg.style.width = rectWidth;
        svg.style.height = rectHeight;
    }

    adaptBlocks(){
        let pf = document.getElementById("play_field");
        // let pf_height = pf.offsetHeight;
        // let pf_width = pf.offsetWidth;
        for (let i = 1; i < this.#blocks.length; i++){
            this.#blocks[i].style.width = parseFloat(this.#blocks[i].style.width)/this.#widthProportion;
            this.#blocks[i].style.height = parseFloat(this.#blocks[i].style.height)/this.#heightProportion;
            let rectaingle = this.#blocks[i].getElementById("rect" + i);
            rectaingle.style.width = parseFloat(this.#blocks[i].style.width)/this.#widthProportion;
            rectaingle.style.height = parseFloat(this.#blocks[i].style.height)/this.#heightProportion;
            this.#blocks[i].style.top = parseFloat(this.#blocks[i-1].style.top)-2*parseFloat(this.#blocks[i].style.height);
            //this.#blocks[i].style.top = parseFloat(this.#blocks[i].style.top)/this.#heightProportion;
            this.#blocks[i].style.left = parseFloat(this.#blocks[i].style.left)/this.#widthProportion;
        }
    }

    #flashAndFocus(input, period=150){
        this.#changeBackground(input, "#fca2c1")
        setTimeout(function()
        {
            this.#changeBackground(input, "#white")
            setTimeout(function()
            {
                this.#changeBackground(input, "#fca2c1")
                setTimeout(function()
                {
                    this.#changeBackground(input, "white");
                    setTimeout(function()
                    {
                        this.#changeBackground(input, "#fca2c1");
                        setTimeout(this.#changeBackground(input, "white", true), period);
                    }, period);
                }, period);
            }, period);
        }, period);
    }

    #changeBackground(input, color, focus = false) {
        input.style.backgroundColor = color;
        if (focus)
            input.focus();
    }

    #addBlock(){
        let donor = this.#blocks.at(-1); 
        let newBlock = donor.cloneNode(true);
        newBlock.id = "block" + this.#blocks.length;
        let rect = newBlock.getElementsByTagName("rect")[0];
        rect.id = "rect" + this.#blocks.length;
        rect.setAttribute("fill", this.#colors[this.#blocks.length % this.#colors.length])
        this.#blocks.push(newBlock);
        donor.parentElement.appendChild(newBlock);
        newBlock.style.top = parseFloat(newBlock.style.top) - 2*parseFloat(newBlock.style.height);
        newBlock.style.left = 0;
        this.#animationStatus = true;
        requestAnimationFrame(this.#tick);
    }

    #tick() {
        if (!this.#animationStatus){
            this.#cropBlock();
            if (this.#gameStatus){
                this.#addBlock();
            }
            return;
        }
        let pf = document.getElementById("play_field");
        let pfWidth = pf.offsetWidth;
        let activeBlock = this.#blocks.at(-1);
        let activeBlockWidth = parseFloat(activeBlock.style.width);
        let activeBlocLeft = parseFloat(activeBlock.style.left);
    
        if ((activeBlocLeft + this.#blockVelocity + activeBlockWidth)>=pfWidth){
            this.#blockVelocity = -this.#blockVelocity;
            activeBlock.style.left = (pfWidth - activeBlockWidth)+"px";
        }
    
        if ((activeBlocLeft + game.blockVelocity)<0){
            this.#blockVelocity = -this.#blockVelocity;
            activeBlock.style.left = "0px";
        }
        
        activeBlock.style.left = activeBlocLeft + this.#blockVelocity;
        if (this.#animationStatus){
            requestAnimationFrame(this.#tick);
        }
        else{
            this.#cropBlock();
            if (this.#gameStatus){
                this.#addBlock();
            }
        } 
    }

    #cropBlock(){
        let init_left = parseFloat(this.#blocks.at(-2).style.left);
        let init_width = parseFloat(this.#blocks.at(-2).style.width);
        let block = this.#blocks.at(-1);
        let current_left = parseFloat(block.style.left);
        let current_width = parseFloat(block.style.width);
        if (current_left+current_width <= init_left || current_left>= init_left+init_width){
            this.stopTick();
            this.#stopGame();
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
        // console.log(ratio);
        this.#score += Math.round(50*ratio*this.#blocks.length);
        document.getElementById("currentScore").innerText = this.#score;
    }

    updateLeaderBoard(){
        document.getElementById("leaderboard").innerText = JSON.stringify(this.leaderBoard);
    }

    stopTick(){
        this.#animationStatus = false;
    }
    
    #stopGame(){
        this.#gameStatus = false;
        let ot = document.getElementById("overlayText");
        ot.style.display = "block";
        let un = document.getElementById("userName");
        un.style.display = "block";
    
        getScores();
        endScores();
    }

    #escape(text) {
        if ( !text )
            return text;
        return text.toString()
            .split("&").join("&amp;")
            .split("<").join("&lt;")
            .split(">").join("&gt;")
            .split('"').join("&quot;")
            .split("'").join("&#039;");
    }

}

let game = new Game();

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
            game.leaderBoard=JSON.parse(data.result);
            game.updateLeaderBoard();
        }
    }
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
            if (score >= parseInt(element.score) && push){
                new_scores.push({"name":username,"score":score.toString()});
                push = !push;
            }
            new_scores.push(element);
        });
        if (push){
            new_scores.push({"name":username,"score":score.toString()});
        }
        game.leaderBoard = new_scores.slice(0, new_count);
        
        $.ajax( {
                url : ajaxHandlerScript,
                type : 'POST', dataType:'json',
                data : { f : 'UPDATE', n : stringName,
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
        game.updateLeaderBoard();
}

function errorHandler(jqXHR,statusStr,errorStr) {
    alert(statusStr+' '+errorStr);
}
