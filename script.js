//Input fields
const prev = document.getElementById('prev');
const curr = document.getElementById('curr');
const rate = document.getElementById('rate');

//Summary fields
const prevunits = document.getElementById('prevunits');
const currentunits = document.getElementById('currentunits');
const totalunits = document.getElementById('totalunits');
const unitrate = document.getElementById('unitrate');
const totalelectricity = document.getElementById('totalelectricity');
const totalwater = document.getElementById('totalwater');
const totalbill = document.getElementById('totalbill');

//Buttons
const calcBtn = document.getElementById('calc');
const clearBtn = document.getElementById('clear');

//Message and clipboard
const error = document.getElementById('error');
const copyBtn = document.getElementById('copyBtn');

// event handler for calculate button
calcBtn.addEventListener('click', () => {
    //Reset summary before calculation
    resetSummary();
    if (validate(prev.value, curr.value, rate.value)) {
        calculate(prev.value, curr.value, rate.value);
    }
});

// event handler for clear button
clearBtn.addEventListener('click', ()=>{
    clearFields();
    resetSummary();
});

// event handler for copy to clipboard button
copyBtn.addEventListener('click', copySummary);

// input validation
function validate(prev, curr, rate) {
    isvalid = true;
    message = "";
    if (prev === '' || curr === '' || rate == '') {
        isvalid = false;
        message = 'Previous, current readings and rate are required fields';
    }
    else if (prev < 0 || curr < 0 || rate < 0) {
        isvalid = false;
        message = 'Previous, current readings or rate cannot be negative';
    }
    else if (Number(prev) > Number(curr)) {
        isvalid = false;
        message = 'Previous reading cannot be greater than current reading';
    }
    if (!isvalid) {
        error.innerText = message;
    }
    else {
        error.innerText = '';
    }

    return isvalid;
}

// main calculation function
function calculate(prev, curr, rate) {
    const waterFixed = 200;
    const units = curr - prev;
    const totalElect = units * rate;
    const total = (units * rate) + waterFixed;

    prevunits.textContent = prev;
    currentunits.textContent = curr;
    totalunits.textContent = units;
    unitrate.textContent = rate;
    totalelectricity.textContent = totalElect;
    totalwater.textContent = waterFixed;
    totalbill.textContent = total;
}

// clear all input, summary and message
function clearFields() {
    prev.value = '';
    curr.value = '';
    rate.value = 6.1;
    error.innerText = '';
}

//Reset summary
function resetSummary() {
    prevunits.textContent = "—";
    currentunits.textContent = '—';
    totalunits.textContent = '—';
    unitrate.textContent = '—';
    totalelectricity.textContent = '—'; 
    totalwater.textContent = '—';
    totalbill.textContent = '—';
}

// copy summary to clipboard
async function copySummary() {

    prevunit = prevunits.textContent;
    currentunit = currentunits.textContent;
    totalunit = totalunits.textContent;
    electricity = totalelectricity.textContent;
    water = totalwater.textContent;
    bill = totalbill.textContent;

    const text = `
    Previous Reading: ${prevunit}\n
    Current Reading: ${currentunit}\n
    Units Consumed: ${totalunit}\n
    Rate per unit (Rs.): ${rate}\n
    Electricity (Units * Rate) in Rs.: ₹${electricity}\n
    Water (Fixed) in Rs.: ₹${water}\n
    Total (Electricity + Water) in Rs.: ₹${bill}
    `;

    if (prevunit == '—' && currentunit == '—' && totalunit == '—' && electricity == '—' && water == '—' && bill == '—') {
        // nothing to copy
        error.innerText = 'Nothing to copy.';
        return;
    } 

    try {
        await navigator.clipboard.writeText(text);
        // small visual feedback
        copyBtn.textContent = '✓';
        error.innerText = '';
        setTimeout(() => {
            copyBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M16 4H8C6.9 4 6 4.9 6 6V7H8V6H16V18H8V17H6V18C6 19.1 6.9 20 8 20H16C17.1 20 18 19.1 18 18V6C18 4.9 17.1 4 16 4Z" fill="currentColor"/><path d="M9 8H14C14.55 8 15 8.45 15 9V19C15 19.55 14.55 20 14 20H9C8.45 20 8 19.55 8 19V9C8 8.45 8.45 8 9 8Z" fill="currentColor"/></svg>`;
        }, 2000);
    } catch (err) {
        error.innerText = 'Failed to copy. (browser denied clipboard access)';
        console.error(err);
    }

}

