massive = [];
widthProportion = 0;
heightProportion = 0;
colors = ["red", "blue", "green"];
blockV = 2.5;
animationStatus = false;
gameStatus = true;

function initPositionDonor(resize = false){
    let pf = document.getElementById("play_field");
    let pf_height = pf.offsetHeight;
    let pf_width = pf.offsetWidth;
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
    newBlock.style.left = parseFloat(newBlock.style.left) + 20;
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
}

function cropBlock(){
    let init_left = parseFloat(massive.at(-2).style.left);
    let init_width = parseFloat(massive.at(-2).style.width);
    let block = massive.at(-1);
    let current_left = parseFloat(block.style.left);
    let current_width = parseFloat(block.style.width);
    if (current_left+current_width <= init_left || current_left>= init_left+init_width){
        alert("game over!");
        stopTick();
        stopGame();
        return;
    }
    if (current_left > init_left){
        block.style.width = parseFloat(block.style.width)+(init_left-current_left);
    }
    if (init_left > current_left){
        block.style.width = parseFloat(block.style.width)-(init_left-current_left);
        block.style.left = parseFloat(block.style.left)+(init_left-current_left);
    }
}