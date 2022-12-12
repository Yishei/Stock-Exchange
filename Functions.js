window.addEventListener('load',function(){
    generateTable();
})
// function to generate the stock Table
function generateTable() {
    let tableBody = document.getElementById('tableB');
    tableBody.innerHTML = null;
    for (let i = 0; i < companies.length; i++) {
        tableRowGenerater(tableBody, i);
    };
    totalRowGenerater(tableBody);
};


async function tableRowGenerater(tableBody, i) {
    let trElement = createAndAppend('tr', tableBody);
    trElement.id = companies[i].ticker;
    let logoTd = createAndAppend('td', trElement);
    let img = createAndAppend('img', logoTd);
    img.src = companies[i].logo;
    img.width = 175;
    img.height = 100;
    
    if(companies[i].price.d != new Date().getDate()){
        let obj = await getLastClosePrice(companies[i].ticker);
        companies[i].price.d = obj.day;
        companies[i].price.p = obj.response;
    };
    companies[i].value = companies[i].price.p * companies[i].amount;
    createAndAppend('td', trElement, companies[i].ticker);
    createAndAppend('td', trElement, currencyFormat(companies[i].price.p));
    createAndAppend('td', trElement, numberFormat(companies[i].amount));
    createAndAppend('td', trElement, currencyFormat(companies[i].value));
    let btn1Td = createAndAppend('td', trElement)
    let btn1 = createAndAppend('button', btn1Td, companies[i].amount ? 'Buy More' : 'Buy');
    btn1.id = 'buy';
    btn1.addEventListener('click', function () {
        buyStocks(i);
    });
    let btn2Td = createAndAppend('td', trElement, null);
    let btn2 = createAndAppend('button', btn2Td, companies[i].amount ? 'Sell' : 'remove');
    btn2.id = 'remove';
    btn2.addEventListener('click', function () {
            sellOrRemove(i);
    });
};

function totalRowGenerater(table) {
    if (companies.length > 0) {
        let totalStocks = 0;
        let totalValue = 0;
        for (let company of companies) {
            totalStocks += company.amount;
            totalValue += company.value;
        };
        let totalTr = createAndAppend('tr', table, null);
        totalTr.id = 'totalRow';
        createAndAppend('td', totalTr, 'Total');
        createAndAppend('td', totalTr);
        createAndAppend('td', totalTr);
        createAndAppend('td', totalTr, numberFormat(totalStocks));
        createAndAppend('td', totalTr, currencyFormat(totalValue));
        createAndAppend('td', totalTr);
        createAndAppend('td', totalTr);
    };
};

/**
 * function to create inner table elements and append the data.
 * @param {HTMLElement} elType 
 * @param {HTMLElement} appendTo 
 * @param {string} innerText 
 * @returns HTMLElement
 */
function createAndAppend(elType, appendTo, innerText = null) {
    let element = document.createElement(elType);
    element.innerHTML = innerText;
    appendTo.append(element);
    return element;
};

// function to format currency to USD.
function currencyFormat(value) {
    let niceValue = value = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    return niceValue
};


// function to format amount.
function numberFormat(value) {
    let niceNumber;
    if (value) {
        niceNumber = value = Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(value);
    } else {
        niceNumber = 0;
    }
    return niceNumber
};

// function to generate the buy form.
function buyStocks(i) {
    if (!colculateTimes().isOpen) {
        alert('Market are closed now');
    } else {
        let qty = prompt(`How much ${companies[i].ticker} stocks do you want to buy?`);
        qty = Number(qty);
        if(isNaN(qty) || qty <= 0){
            alert(`not a valid input!`);
        } else {
            companies[i].amount += qty;
            generateTable();
        }
    };
};
// function to handle the sell/remove button. 
function sellOrRemove(i) {
    if (companies[i].amount <= 0) {
        companies.splice(i, 1);
        generateTable();
    } else {
        sellStocks(i);
    };


};

// function to generate a sell form.
function sellStocks(i) {
    if (!colculateTimes().isOpen) {
        alert('Market are closed now');
    } else {
        let qty = prompt(`How much ${companies[i].ticker} stocks do you want to sell?`);
        qty = Number(qty);
        if(isNaN(qty) || qty <= 0 || qty > companies[i].amount){
            alert(`not a valid input!`);
        } else {
            companies[i].amount -= qty;
            generateTable();
        };
    };
};

function filter(){
    let tableBody = document.getElementById('tableB');
    tableBody.innerHTML = null;
    for(let i = 0; i < companies.length; i++){
        if(companies[i].amount){
            tableRowGenerater(tableBody, i);
        }
    }
    totalRowGenerater(tableBody);
    document.getElementById('filter-button').style.display = 'none';
    document.getElementById('remove-filter').style.display = 'block';
};


function removeFilter(){
    generateTable();
    document.getElementById('remove-filter').style.display = 'none';
    document.getElementById('filter-button').style.display = 'block';
}
async function getLastClosePrice(ticker){
    let today = new Date().getDate();
    let response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=_7I6zHnwCXTS7ZaeHW2oWLBkbYCyxASg`);
    response = await response.json();
    return {
        response : response.results[0].c,
        day : today
    };
};