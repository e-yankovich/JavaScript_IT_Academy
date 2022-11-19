//Класс для управление параметрами игровых блоков.
class Block {

    id;
    element;
    top;
    left;
    width;
    height;

    //Обновляет параметры в разметке.
    update(){
        this.element.id = this.id;
        this.element.style.top = this.top;
        this.element.style.left = this.left;
        this.element.style.width = this.width;
        this.element.style.height = this.height;
    }

    //Адаптируется под новые размеры страницы согласно пропорциям.
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

    //Рассчет движения блока.
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

    //Обрезка блока после его установки.
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
    
    //Получение элемента блока.
    propagate_element(){
        this.element = document.getElementById(this.id);
    }

    //Получение параметров блока.
    propagate_params(){
        this.id = this.element.id;
        this.top = this.element.style.top;
        this.left = this.element.style.left;
        this.width = this.element.style.width;
        this.height = this.element.style.height;
    }
    
    //Инициализация прямоугольника внутри svg.
    init_rect(count, color){
        let rect = this.element.getElementsByTagName("rect")[0];
        rect.id = "rect" +count;
        rect.setAttribute("fill", color);
    }
}

//Контейнер для параметров игры.
class Game{

    blocks = []; //Активные блоки.
    leaderBoard = []; //Таблица рекордов.
    #widthProportion = 0; //Соотношения сторон страниц до и после ресайза.
    #heightProportion = 0; //Соотношения сторон страниц до и после ресайза.
    #colors = ["#888888", "#c6c6c6", "#eacdab"]; //Цвета блоков.
    #blockVelocity = 2.5; //Скорость анимации блока.
    #animationStatus = false; //Статус анимации. True - анимация идет. False - анимация прекращена.
    #gameStatus = true; //Статус игры. True - игра идет. False - игра прекращена.
    #score = 0; //Текущее количество очков.
    #username = ""; //Имя пользователя.
    #ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php"; //URL для взаимодействия с хранилищем.
    #containerName="YANKOVICH_BLOCKSBUILDER_SCORE"; //Название строки в хранилище.

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

//Вспомогательный класс для работы с разметкой.
class MrkpHlpr {

    toggle_element(element, hide = true){
        if (hide){
            element.style.display = "none";
        }
        else {
            element.style.display = "block";
        }
    }
    
    //Подсвечивание элемента.
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

//Начало игры - подготовка параметров, установка начального блока, адаптация под размеры страницы.
function startGame(event){

    event = event || window.event;
    event.stopPropagation();

    game.set_score(); //Получение и отображение таблицы рекордов.
    document.getElementById("current_score").innerText = "0"; //Установка нулевого количества очков в начале игры.
    input = document.getElementById("playerName");
    let inputedPlayerName = input.value;
    if (inputedPlayerName.trim()== ""){ //Валидация пустого значения имени пользователя.
        helper.flashAndFocus(input, ['#fca2c1', 'white']);
        return;
    }
    if (inputedPlayerName.length > 15){ //Ограничение на длину имени пользователя.
        helper.toggle_element(document.getElementById("warning"), false);
        helper.flashAndFocus(input, ['#fca2c1', 'white']);
        return;
    }
    helper.toggle_element(document.getElementById("warning"));
    game.set_username(escape(input.value.trim()));
    
    for (let i = 1; i <game.blocks.length; i++){ //Очистка игрового поля от блоков предыдущей игры.
        game.blocks[i].element.parentElement.removeChild(game.blocks[i].element);
    }
    game.blocks = game.blocks.slice(0,1);
    game.set_gameStatus(true);
    addBlock();
    let ot = document.getElementById("overlay_text");
    helper.toggle_element(ot);
}

function initPositionDonor(resize = false){ //Инициализация стартового блока. Вызывается также при изменении размеров страницы для адаптации блока.
    let pf = document.getElementById("play_field");
    let pf_height = pf.offsetHeight;
    let pf_width = pf.offsetWidth;
    let ot = document.getElementById("overlay_text");
    ot.style.height = pf_height+"px";
    ot.style.width = pf_width+"px";

    resizeText("small_text", pf_height, 0.025);
    resizeText("big_text", pf_height, 0.05);
    document.getElementById("button").style.height = (pf_height*0.12)+"px";
    document.getElementById("playerName").style.height = (pf_height*0.03)+"px";

    let rect = document.getElementById("donor_rect");
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

//Подгонка размеров текста под размеры окна.
function resizeText(className, startValue, proportion){
    small_text = document.getElementsByClassName(className);
    for (let i = 0; i < small_text.length; i++){
        small_text[i].style.fontSize = (startValue*proportion)+"px";
    }
}

function addBlock(){ //Добавление нового блока на игровое поле. Старт плавной анимации.
    if (game.blocks.length == 24){ //Проверка условий достижения максимального количества блоков на игровом поле.
        stopTick();
        stopGame();
        return;
    }
    let donor = game.blocks.at(-1); 
    let newBlock = new Block();
    newBlock.element = donor.element.cloneNode(true); //Создание нового блока на основе стартового блока или предыдущего.
    newBlock.id = "block" + game.blocks.length;
    newBlock.init_rect(game.blocks.length, game.get_colors()[game.blocks.length%game.get_colors().length])

    game.blocks.push(newBlock);
    donor.element.parentElement.appendChild(newBlock.element); //Добавление элемента блока в игровое поле.
    newBlock.propagate_params()
    newBlock.top = parseFloat(newBlock.top) - 2*parseFloat(newBlock.height); //Установка расположение блока так, чтобы он оказался над предыдущим.
    newBlock.left = 0;
    newBlock.update();
    game.set_animationStatus(true);
    requestAnimationFrame(tick);
}

function adaptBlocks(){ //Адаптация всех блоков под новые размеры страницы.
    for (let i = 1; i <game.blocks.length; i++){
        let wp = game.get_widthProportion(); 
        let hp = game.get_heightProportion();
        game.blocks[i].adapt(wp, hp, game.blocks[i-1].element.style.top, i);
    }
}

function tick() { //Анимация движения блока.
    if (!game.get_animationStatus()){ //Проверка статуса анимации.
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
    
    if (game.get_animationStatus()){ //Дополнительная порверка, что анимация не была выключена.
        requestAnimationFrame(tick); //Плавная анимация.
    }
    else{
        cropBlock();
        if (game.get_gameStatus()){ //Проверка статуса игры после обрезки установленного блока.
            addBlock();
        }
    } 
}

function stopTick(){ //Остановка анимации.
    game.set_animationStatus(false);
}

function stopGame(){ //Остановка игры и отображение меню.
    game.set_gameStatus(false);
    helper.toggle_element(document.getElementById("overlay_text"), false);
    helper.toggle_element(document.getElementById("user_name"), false)
    helper.toggle_element(document.getElementById("game_over"), false)
    getScores();
    sendScores();
}

function cropBlock(){ //Обрезка установленного блока.
    let init_left = parseFloat(game.blocks.at(-2).left);
    let init_width = parseFloat(game.blocks.at(-2).width);
    let block = game.blocks.at(-1);
    let current_left = parseFloat(block.left);
    let current_width = parseFloat(block.width);
    if (current_left+current_width <= init_left || current_left>= init_left+init_width){ //Проверка, вышел ли остановленный блок за границы предыдущего.
        stopTick();
        stopGame(); //Конец игры, т.к. пользователь промахнулся.
        return;
    }
    let ratio = block.crop(init_left, init_width);
    if(ratio<0){
        ratio = 1 + ratio;
    }
    game.update_score(ratio); //Начисление очков порпорционально ширине установленного блока.
    document.getElementById("current_score").innerText = game.get_score();
}

function escape(text) { //Замена управляющих симфолов на эскейп последовательности.
    if ( !text )
        return text;
    return text.toString()
        .split("&").join("&amp;")
        .split("<").join("&lt;")
        .split(">").join("&gt;")
        .split('"').join("&quot;")
        .split("'").join("&#039;");
}

function getScores() { //Асинхронное получение таблицы рекордов.
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

function showScores(data) { //Проверка полученных данных.
    if ( data.error!=undefined )
        alert(data.error);
    else {
        if ( data.result!="" ) { 
            game.leaderBoard=JSON.parse(data.result);
            updateLeaderBoard();
        }
    }
}

function updateLeaderBoard(){ //Пересчет и отображение таблицы рекордов.
    for (let i=1; i<=3; i++){
        if (game.leaderBoard.length >= i && game.leaderBoard[i-1].score>0){
            document.getElementById("leaderboard" + i).innerText = game.leaderBoard[i-1].name + ": " + game.leaderBoard[i-1].score;
        }
        else {
            document.getElementById("leaderboard" + i).innerText = "---"
        }
    }
    document.getElementById("current_record").innerText = game.leaderBoard.length >= 0 ? game.leaderBoard[0].score : "---";
}

function sendScores() { //Запрос на обновление таблицы рекордов.
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

function lockGetReady(data) { //Пересчет и отправка таблицы рекордов.
    if ( data.error!=undefined )
        alert(data.error);
    else {
        if ( data.result!="" ) { 
            game.leaderBoard=JSON.parse(data.result);
        }

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

function updateReady(data) { //Проверка данных после обновления и отображение таблицы рекордов пользователю.
    if ( data.error!=undefined )
        alert(data.error);
    updateLeaderBoard();
}

function errorHandler(jqXHR,statusStr,errorStr) { //Обработчик ошибок при асинхронной коммуникации.
    alert(statusStr+' '+errorStr);
}