'use strict';
const list = document.querySelector('.ingredients-list');
const subtotalEl = document.querySelector('.cost__subtotal');
const shippingEl = document.querySelector('.cost__shipping');
const totalEl = document.querySelector('.cost__total');
const checkBtn = document.querySelector('.btn--check');
const uncheckBtn = document.querySelector('.btn--uncheck');

const currency = '€';

function createElement(tag, classEl) {
  const newElement = document.createElement(tag);
  newElement.classList.add(classEl);
  return newElement;
}

function createText(text) {
  const newText = document.createTextNode(text);
  return newText;
}

function addTextToElement(tag, classEl, text) {
  const elementCreated = createElement(tag, classEl);
  const textCreated = createText(text);
  elementCreated.appendChild(textCreated);
  return elementCreated;
}

function createInputType(classDiv, classEl, type, id, name, value) {
  const inputWrapper = createElement('div', classDiv);
  const newInputLabel = createElement('label', 'label-input');
  const newInputForm = createElement('input', classEl);
  newInputLabel.setAttribute('for', id.replace(/\s+/g, ''));
  newInputForm.setAttribute('type', type);
  newInputForm.setAttribute('id', id.replace(/\s+/g, ''));
  newInputForm.setAttribute('name', name);
  if (value !== undefined) {
    newInputForm.setAttribute('value', value);
    newInputForm.setAttribute('Min', 0);
  }
  inputWrapper.appendChild(newInputForm);
  inputWrapper.appendChild(newInputLabel);
  return inputWrapper;
}

function createInputBox(classDiv, productNames, priceCurrency) {
  const inputWrapper = createElement('div', classDiv);
  const newCheckbox = createInputType('checkbox-wrapper','list--input__checkbox', 'checkbox', productNames, productNames);
  newCheckbox.addEventListener('click', getCheckeds);
  const defaultQty = 1;
  const newInputNumber = createInputType('input-number-wrapper','list--input__number', 'number', productNames, productNames, defaultQty);
  const appendPrice = addTextToElement('p', 'ingredients-list__price', priceCurrency);
  inputWrapper.appendChild(newCheckbox);
  inputWrapper.appendChild(newInputNumber);
  inputWrapper.appendChild(appendPrice);
  newInputNumber.addEventListener('change', getCheckeds);
  return inputWrapper;
}



function getRecipe() {
  const recipeFromLS = JSON.parse(localStorage.getItem('recipe'));
  if (recipeFromLS !== null) {
    paint(recipeFromLS);
  } else {
    fetchElements();
  }
}

function fetchElements() {
  fetch('https://raw.githubusercontent.com/Adalab/recipes-data/master/rissoto-setas.json')
    .then(response => response.json())
    .then(function (data) {
      const dataArray = data.recipe.ingredients;
      localStorage.setItem('recipe', JSON.stringify(dataArray));
      paint(dataArray);
    })//end of data processing
    .catch(function (error) { console.log('error', error); });
}//end of fetch function

getRecipe();

function paint(dataArray) {
  for (let i = 0; i < dataArray.length; i++) {
    let productNames = dataArray[i].product;
    let productBrands = dataArray[i].brand;
    if (productBrands === undefined) {
      productBrands = '';
    }
    else {
      productBrands = dataArray[i].brand;
    }
    let appendBrands = addTextToElement('p', 'ingredients-list__brand', productBrands);
    let productQty = dataArray[i].quantity;
    let priceItem = dataArray[i].price;
    let priceCurrency = `${priceItem} ${currency}`;
    const appendNames = addTextToElement('h4', 'ingredients-list__name', productNames);
    const appendQty = addTextToElement('p', 'ingredients-list__qty', productQty);
    const liItem = createElement('li', 'ingredients-list__item');
    const wrappedInputs = createInputBox('all-input-wrapper', productNames, priceCurrency);
    liItem.appendChild(appendNames);
    liItem.appendChild(appendBrands);
    liItem.appendChild(appendQty);
    liItem.appendChild(wrappedInputs);
    list.appendChild(liItem);
  }//end of for loop
}

function getCheckeds() {
  const checkBox = document.querySelectorAll('.list--input__checkbox');
  let checkInput = document.querySelectorAll('.list--input__number');
  let checkPrice = document.querySelectorAll('.ingredients-list__price');
  let sum = 0;
  for (let i = 0; i < checkBox.length; i++) {
    if (checkBox[i].checked === true) {
      let inputValueNum = checkInput[i].value;
      let priceStr = checkPrice[i].innerText.replace(' €', '');
      let priceNum = parseFloat(priceStr);
      let mult = (priceNum * inputValueNum);
      const multFixed = mult.toFixed(2);
      const multParse = parseFloat(multFixed);
      sum += multParse;
    }
  }
  const totalSumNum = parseFloat(sum);
  const totalSumParsed = totalSumNum.toFixed(2);
  subtotalEl.innerHTML = `Subtotal ${totalSumParsed} euros`;
  const shipping = 7;
  shippingEl.innerHTML = `Gastos de envio: ${shipping} euros`;
  const totalCost = totalSumNum + shipping;
  const totalPriceFixed = totalCost.toFixed(2);
  const totalCostDetail = `El coste total es ${totalPriceFixed} euros`;
  totalEl.innerHTML = `${totalCostDetail}`;
}

function selectAllItems() {
  const checkBox = document.querySelectorAll('.list--input__checkbox');
  for (let i = 0; i < checkBox.length; i++) {
    checkBox[i].checked = true;
  }
  getCheckeds();
}

function unSelectAllItems() {
  const checkBox = document.querySelectorAll('.list--input__checkbox');
  for (let i = 0; i < checkBox.length; i++) {
    checkBox[i].checked = false;
  }
  getCheckeds();
}

checkBtn.addEventListener('click', selectAllItems);
checkBtn.addEventListener('click', getCheckeds);
uncheckBtn.addEventListener('click', unSelectAllItems);



//# sourceMappingURL=main.js.map
