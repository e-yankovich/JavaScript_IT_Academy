"use strict"
var formDef1=
[
  {label:'Название сайта:',kind:'longtext',name:'sitename'},
  {label:'URL сайта:',kind:'longtext',name:'siteurl'},
  {label:'Посетителей в сутки:',kind:'number',name:'visitors'},
  {label:'E-mail для связи:',kind:'shorttext',name:'email'},
  {label:'Рубрика каталога:',kind:'combo',name:'division',
    variants:[{text:'здоровье',value:1},{text:'домашний уют',value:2},{text:'бытовая техника',value:3}]},
  {label:'Размещение:',kind:'radio',name:'payment',
    variants:[{text:'бесплатное',value:1},{text:'платное',value:2},{text:'VIP',value:3}]},
  {label:'Разрешить отзывы:',kind:'check',name:'votes'},
  {label:'Описание сайта:',kind:'memo',name:'description'},
  {caption:'Опубликовать',kind:'submit'},
];

var formDef2=
[
  {label:'Фамилия:',kind:'longtext',name:'lastname'},
  {label:'Имя:',kind:'longtext',name:'firstname'},
  {label:'Отчество:',kind:'longtext',name:'secondname'},
  {label:'Возраст:',kind:'number',name:'age'},
  {caption:'Зарегистрироваться',kind:'submit'},
];

function createForm(formDef, formElement){
    formDef.forEach(element => {
        if (element.kind == "longtext"){
            let labelElement = document.createElement("label");
            labelElement.innerHTML = element.label;
            formElement.appendChild(labelElement);
            let newFormItem = document.createElement("input");
            newFormItem.type = "text";
            newFormItem.name = formDef.name;
            newFormItem.style.width = "400px";
            formElement.appendChild(newFormItem);
        }

        if(element.kind == "number"){
            let labelElement = document.createElement("label");
            labelElement.innerHTML = element.label;
            formElement.appendChild(labelElement);
            let newFormItem = document.createElement("input");
            newFormItem.type = "number";
            newFormItem.name = formDef.name;
            formElement.appendChild(newFormItem);
        }

        if(element.kind == "shorttext"){
            let labelElement = document.createElement("label");
            labelElement.innerHTML = element.label;
            formElement.appendChild(labelElement);
            let newFormItem = document.createElement("input");
            newFormItem.type = "text";
            newFormItem.name = formDef.name;
            newFormItem.style.width = "200px";
            formElement.appendChild(newFormItem);
        }

        if(element.kind == "combo"){
            let labelElement = document.createElement("label");
            labelElement.innerHTML = element.label;
            formElement.appendChild(labelElement);
            let newFormItem = document.createElement("select");
            newFormItem.name = formDef.name;
            formElement.appendChild(newFormItem);
            element.variants.forEach(deepElement=>{
                let opt = document.createElement("option");
                opt.innerText = deepElement.text;
                opt.value = deepElement.value;
                newFormItem.appendChild(opt);
            });  
        }

        if (element.kind == "radio"){
            let labelElement = document.createElement("label");
            labelElement.innerHTML = element.label;
            formElement.appendChild(labelElement);
            let divElement = document.createElement("div");
            formElement.appendChild(divElement);
            element.variants.forEach(deepElement=>{
                let newFormItem = document.createElement("input");
                newFormItem.type = "radio";
                newFormItem.name = formDef.name;
                newFormItem.value = deepElement.value;
                newFormItem.id = deepElement.text;
                let labelElement = document.createElement("label");
                labelElement.innerHTML = deepElement.text;
                labelElement.for = deepElement.text;
                divElement.appendChild(labelElement);
                divElement.appendChild(newFormItem);
            });  
        }

        if (element.kind == "check"){
            let labelElement = document.createElement("label");
            labelElement.innerHTML = element.label;
            formElement.appendChild(labelElement);
            let newFormItem = document.createElement("input");
            newFormItem.type = "checkbox";
            newFormItem.name = formDef.name;
            formElement.appendChild(newFormItem);
        }

        if (element.kind == "memo"){
            let labelElement = document.createElement("label");
            labelElement.innerHTML = element.label;
            formElement.appendChild(labelElement);
            let newFormItem = document.createElement("textarea");
            newFormItem.name = formDef.name;
            newFormItem.rows = "3";
            newFormItem.cols = "50";
            formElement.appendChild(newFormItem);
        }

        if (element.kind == "submit"){
            let newFormItem = document.createElement("input");
            newFormItem.type = "submit";
            newFormItem.value = element.caption;
            formElement.appendChild(newFormItem);
        }
    });
}