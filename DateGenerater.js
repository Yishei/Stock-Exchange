window.onload = function () {
    displayDate();
    setInterval(displayDate, 1000);
    displayColculatedTime();
    setInterval(displayColculatedTime, 1000);

};

function displayDate() {
    document.getElementById('date').innerHTML = new Date().toLocaleString();
};

function displayColculatedTime() {
    let el1 = document.querySelector('#marketStatus');
    let el2 = document.querySelector('#hours-diff');
    el1.innerHTML = colculateTimes().status;
    el2.innerHTML = colculateTimes().msg;
}

function colculateTimes() {
    const OPEN_TIME = new Date(new Date().setHours(9, 30, 00, 00));
    const CLOSING_TIME = new Date(new Date().setHours(16, 30, 00, 00));
    let fromOpen = diffInMinutes(OPEN_TIME, new Date());

    let toClose = diffInMinutes(new Date(), CLOSING_TIME);
    let fromClose = diffInMinutes(CLOSING_TIME, new Date());

    if (!isBuisnessDay()) return {
        msg: `The Markets are Closed on WeekEnd`,
        status: 'Markets Closed',
        isOpen: false
    }
    if (fromOpen < 0) return {
        msg: `The markets will Open in ${minutesToTime(fromOpen * -1).h} Hours and ${minutesToTime(fromOpen * -1).m} Minutes!`,
        status: 'Markets Opening soon',
        isOpen: false
    } ;
    if (toClose > 0) return {
        msg: `The markets Opend ${minutesToTime(fromOpen).h} Hours and ${minutesToTime(fromOpen).m} Minutes ago!`,
        status: 'Markets are Open',
        isOpen: true
    };
    return {
        msg: `The market Closed ${minutesToTime(fromClose).h} Hours and ${minutesToTime(fromClose).m} Minutes ago`,
        status: 'Markets Closed',
        isOpen: false
    };
};

/**
 * 
 * @param {Number} minutes 
 * @returns Object
 */
function minutesToTime(minutes) {
    return {
        h: Math.floor(minutes / 60),
        m: minutes % 60
    };
};

/**
 * 
 * @returns Boolean
 */
function isBuisnessDay() {
    let now = new Date().getDay();
    const WEEKEND = [0, 6];
    return !WEEKEND.includes(now);
};

/**
 * 
 * @param {Date} date
 * @return Number 
 */
function dateToMinutes(date) {
    const HOURS = date.getHours();
    const MINUTES = date.getMinutes();
    return (HOURS * 60) + MINUTES;
};

/**
 * 
 * @param {Date} from 
 * @param {Date} to 
 * @returns Number
 */
function diffInMinutes(from, to) {
    return dateToMinutes(to) - dateToMinutes(from);
};