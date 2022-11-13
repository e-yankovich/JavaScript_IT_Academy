"use strict"
function initForm(){
    const formElement = document.forms.valid_form;
    formElement.onsubmit = submitForm;
}

function validationDevelopers(focusOnErrorElement){
    const formElement = document.forms.valid_form;
    const developersElement = formElement.elements.developers;
    const developersValue = developersElement.value;
    const developersValueError = document.getElementById("errMessDevelopers");
    //checking if user left form field unfilled
    if (!developersValue == ""){
        developersValueError.innerHTML = ""
        //if data is inserted correctly there is no need to focus on the form element,
        //then function returns false
        return false;
    }
    else {
        developersValueError.innerHTML = "Введите данные"
        if (focusOnErrorElement){
            developersElement.focus();
        }
        //if data is inserted with errors we need to focus on the form element,
        //so function returns true
        return true;
    }
}

function validationSitename(focusOnErrorElement){
    const formElement = document.forms.valid_form;
    const sitenameElement = formElement.elements.sitename;
    const sitenameValue = sitenameElement.value;
    const sitenameValueError = document.getElementById("errMessSitename");
    //checking if user left form field unfilled
    if (!sitenameValue == ""){
        sitenameValueError.innerHTML = ""
        //if data is inserted correctly there is no need to focus on form element,
        //then function returns false
        return false;
    }
    else {
        sitenameValueError.innerHTML = "Введите данные"
        if (focusOnErrorElement){
            sitenameElement.focus();
        }
        //if data is inserted with errors we need to focus on the form element,
        //so function returns true
        return true;
    }
}

function validationSiteurl(focusOnErrorElement){
    const formElement = document.forms.valid_form;
    const siteurlElement = formElement.elements.siteurl;
    const siteurlValue = siteurlElement.value;
    const siteurlValueError = document.getElementById("errMessSiteurl");
    //checking if user left form field unfilled
    if (!siteurlValue == ""){
        siteurlValueError.innerHTML = ""
        //if data is inserted correctly there is no need to focus on form element,
        //then function returns false
        return false;
    }
    else {
        siteurlValueError.innerHTML = "Введите данные"
        if (focusOnErrorElement){
            siteurlElement.focus();
        }
        //if data is inserted with errors we need to focus on the form element,
        //so function returns true
        return true;
    }
}

function validationStartdate(focusOnErrorElement){
    const formElement = document.forms.valid_form;
    const startdateElement = formElement.elements.startdate;
    const startdateValue = startdateElement.value;
    const startdateValueError = document.getElementById("errMessStartdate");
    //checking if user left form field unfilled
    if (!startdateValue == ""){
        startdateValueError.innerHTML = ""
        //if data is inserted correctly there is no need to focus on form element,
        //then function returns false
        return false;
    }
    else {
        startdateValueError.innerHTML = "Введите данные"
        if (focusOnErrorElement){
            startdateElement.focus();
        }
        //if data is inserted with errors we need to focus on the form element,
        //so function returns true
        return true;
    }
}

function validationVisitors(focusOnErrorElement){
    const formElement = document.forms.valid_form;
    const visitorsElement = formElement.elements.visitors;
    const visitorsValue = visitorsElement.value;
    const visitorsValueError = document.getElementById("errMessVisitors");
    //checking if user left form field unfilled
    if (!visitorsValue == ""){
        visitorsValueError.innerHTML = ""
        //if data is inserted correctly there is no need to focus on form element,
        //then function returns false
        return false;
    }
    else {
        visitorsValueError.innerHTML = "Введите данные"
        if (focusOnErrorElement){
            visitorsElement.focus();
        }
        //if data is inserted with errors we need to focus on the form element,
        //so function returns true
        return true;
    }
}

function validationEmail(focusOnErrorElement){
    const formElement = document.forms.valid_form;
    const emailElement = formElement.elements.email;
    const emailValue = emailElement.value;
    const emailValueError = document.getElementById("errMessEmail");
    //checking if user left form field unfilled
    if (!emailValue == ""){
        emailValueError.innerHTML = ""
        //if data is inserted correctly there is no need to focus on form element,
        //then function returns false
        return false;
    }
    else {
        emailValueError.innerHTML = "Введите данные"
        if (focusOnErrorElement){
            emailElement.focus();
        }
        //if data is inserted with errors we need to focus on the form element,
        //so function returns true
        return true;
    }
}

function validationDivision(focusOnErrorElement){
    const formElement = document.forms.valid_form;
    const divisionElement = formElement.elements.division;
    const divisionValue = divisionElement.value;
    const divisionValueError = document.getElementById("errMessDivision");
    //checking if user left form field unfilled
    if (divisionValue != "1"){
        divisionValueError.innerHTML = "";
        //if data is inserted correctly there is no need to focus on form element,
        //then function returns false
        return false;
    }
    else {
        divisionValueError.innerHTML = "Выберите значение из выпадающего списка"
        if (focusOnErrorElement){
            divisionElement.focus();
        }
        //if data is inserted with errors we need to focus on the form element,
        //so function returns true
        return true;
    }
}

function validationPayment(focusOnErrorElement){
    const formElement = document.forms.valid_form;
    const paymentElement = formElement.elements.payment;
    const paymentValue = paymentElement.value;
    const paymentValueError = document.getElementById("errMessPayment");
    if (document.getElementById("free").checked || document.getElementById("fee").checked || document.getElementById("vip").checked){
        paymentValueError.innerHTML = ""
        //if data is inserted correctly there is no need to focus on form element,
        //then function returns false
        return false;
    }
    else {
        paymentValueError.innerHTML = "Выберите одно из значений"
        if (focusOnErrorElement){
            paymentElement[0].scrollIntoView();
        }
        //if data is inserted with errors we need to focus on the form element,
        //so function returns true
        return true;
    }
}

function validationReview(focusOnErrorElement){
    const formElement = document.forms.valid_form;
    const reviewElement = formElement.elements.review;
    const reviewValue = reviewElement.checked;
    const reviewValueError = document.getElementById("errMessReview");
    //checking if user left form field unfilled
    if (reviewValue){
        reviewValueError.innerHTML = ""
        //if data is inserted correctly there is no need to focus on form element,
        //then function returns false
        return false;
    }
    else {
        reviewValueError.innerHTML = "Это значение должно быть выбрано"
        if (focusOnErrorElement){
            reviewElement.focus();
        }
        //if data is inserted with errors we need to focus on the form element,
        //so function returns true
        return true;
    }
}

function validationDescription(focusOnErrorElement){
    const formElement = document.forms.valid_form;
    const descriptionElement = formElement.elements.description;
    const descriptionValue = descriptionElement.value;
    const descriptionValueError = document.getElementById("errMessDescription");
    //checking if user left form field unfilled
    if (!descriptionValue == ""){
        descriptionValueError.innerHTML = ""
        //if data is inserted correctly there is no need to focus on the form element,
        //then function returns false
        return false;
    }
    else {
        descriptionValueError.innerHTML = "Введите данные"
        if (focusOnErrorElement){
            descriptionElement.focus();
        }
        //if data is inserted with errors we need to focus on the form element,
        //so function returns true
        return true;
    }
}


function submitForm(eo){
    let functions = [
        validationDevelopers,
        validationSitename,
        validationSiteurl,
        validationStartdate,
        validationVisitors,
        validationEmail,
        validationDivision,
        validationPayment,
        validationReview,
        validationDescription
    ];
    let focused = true;
    functions.forEach(element => {
        if (element(focused)){
            focused = false;
            eo.preventDefault();
        }
    }
    ); 
}