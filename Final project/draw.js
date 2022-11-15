massive = [];
widthProportion = 0;
heightProportion = 0;
colors = ["red", "blue", "green"];

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
