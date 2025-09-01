let transaction = JSON.parse(localStorage.getItem("transactions")) || [];

// Type select
let typeSelect = document.querySelector('select[name="type"]');
let amountInput = document.querySelector('input[type="number"]');
let categorySelect = document.querySelector('select[name="category"]');
let dateInput = document.querySelector('input[type="date"]');
let noteInput = document.querySelector('input[placeholder="Add note (optional)"]');
let addBtn = document.querySelector('.btn');
let form = document.querySelector('form');
const list = document.querySelector(".list");
const categorySelector = document.querySelector("#filter");
const search = document.querySelector(".search-inp");

// list icons
const icons={
    food: "https://cdn-icons-png.flaticon.com/128/857/857681.png",
    travel: "https://cdn-icons-png.flaticon.com/128/854/854996.png",
    bills: "https://cdn-icons-png.flaticon.com/128/8930/8930243.png",
    income: "https://cdn-icons-png.flaticon.com/128/1773/1773345.png",
    other: "https://cdn-icons-png.flaticon.com/128/5501/5501384.png",
    shopping: "https://cdn-icons-png.flaticon.com/128/743/743131.png"
};

// 🔥 Show transaction history
function showTranHistory(arr, limit) {
    list.innerHTML = "";
    const h = document.createElement("h1");
    h.textContent = "Transaction History";
    list.append(h);

    if (arr.length === 0) {
        const msg = document.createElement("p");
        msg.textContent = "No transactions found.";
        msg.classList.add("empty-msg");
        list.append(msg);
        return;
    }

    for (let j = 0; j < limit; j++) {
        const i = arr[j];
        const element = document.createElement('div');
        const inDetails = document.createElement('div');
        const div1 = document.createElement('div');
        const img = document.createElement('img');
        const div2 = document.createElement('div');
        const span1 = document.createElement('span');
        const br = document.createElement('br');
        const span2 = document.createElement('span');
        const span3 = document.createElement('span');
        const div3 = document.createElement('div');
        const span4 = document.createElement('span');
        const delBtn = document.createElement("button");

        element.classList.add("element", "cap");
        inDetails.classList.add("in-details");
        element.appendChild(inDetails);
        img.setAttribute("src", icons[i.category]);
        div1.appendChild(img);
        inDetails.appendChild(div1);

        span1.classList.add("note");
        span1.textContent = i.note;
        div2.appendChild(span1);
        div2.appendChild(br);

        span2.classList.add("category", "cap");
        span2.textContent = i.category;
        span3.classList.add("date");
        span3.textContent = "  " + i.date;
        span2.appendChild(span3);
        div2.appendChild(span2);
        inDetails.appendChild(div2);

        if (i.type === "Income") {
            span4.classList.add("green");
            span4.textContent = "+" + i.amount;
        } else {
            span4.classList.add("red");
            span4.textContent = "-" + i.amount;
        }
        span4.classList.add("font");
        div3.appendChild(span4);
        element.appendChild(div3);

        //  Delete button
        const delImg = document.createElement("img");
        delImg.src="https://cdn-icons-png.flaticon.com/128/1214/1214428.png";
        delBtn.appendChild(delImg);
        delBtn.classList.add("delete-btn");


        delBtn.addEventListener("click", () => {
            transaction.splice(j, 1);
            saveData();
            showTranHistory(transaction, transaction.length);
            dashboard();
            updateChart();
        });
        element.appendChild(delBtn);

        list.appendChild(element);
    }
}

//  Dashboard
function dashboard() {
    let incomeArr = transaction.filter((tran) => tran.type === "Income");
    let expenseArr = transaction.filter((tran) => tran.type === "Expense");

    let inc = incomeArr.reduce((sum, t) => sum + parseInt(t.amount), 0);
    let exp = expenseArr.reduce((sum, t) => sum + parseInt(t.amount), 0);

    const bal = document.querySelector(".balance");
    const incDashboard = document.querySelector(".income");
    const expDashboard = document.querySelector(".expense");

    let balance = inc - exp;
    bal.textContent = balance;
    incDashboard.textContent = inc;
    expDashboard.textContent = exp;

    bal.classList.remove("green", "red");
    if (balance > 0) bal.classList.add("green");
    else if (balance < 0) bal.classList.add("red");
}

//  Save to localStorage
function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transaction));
}

//  Form submit
form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!amountInput.value || isNaN(amountInput.value) || amountInput.value <= 0) {
        alert("Please enter a valid amount!");
        return;
    }
    if (!dateInput.value) {
        alert("Please select a date!");
        return;
    }

    const newTra = {
        type: typeSelect.value,
        amount: amountInput.value,
        category: categorySelect.value,
        note: noteInput.value,
        date: dateInput.value
    };

    transaction.unshift(newTra);
    saveData();
    showTranHistory(transaction, transaction.length);
    dashboard();
    form.reset();
    updateChart();
    categorySelector.selectedIndex = 0;
});

//  Search by note
search.addEventListener("input", () => {
    categorySelector.selectedIndex = 0;
    let filterArr = transaction.filter((tran) =>
        tran.note.toLowerCase().startsWith(search.value.toLowerCase())
    );
    showTranHistory(filterArr, filterArr.length);
});

//  Category filter
categorySelector.addEventListener("change", () => {
    let categoryValue = categorySelector.value;
    if (categoryValue.toLowerCase() === "all") {
        showTranHistory(transaction, transaction.length);
    } else {
        let filterArr = transaction.filter(
            (tran) => tran.category.toLowerCase() === categoryValue.toLowerCase()
        );
        showTranHistory(filterArr, filterArr.length);
    }
});



function updateChart() {
    let categories = ['food', 'travel', 'bills', 'shopping', 'income','other'];
    let totals = categories.map(cat => {
        return transaction.filter(t => t.category === cat).reduce((sum, t) => sum + parseInt(t.amount), 0);
    });

    expenseChart.data.datasets[0].data = totals;
    expenseChart.update(); // refresh chart
}


const ctx = document.querySelector("#expenseChart");

const expenseChart = new Chart(ctx, {
    type: 'pie', 
    data: {
        labels: ['Food', 'Travel', 'Bills', 'Shopping', 'income','Other'], // categories
        datasets: [{
            label: 'Expenses',
            data: [0, 0, 0, 0, 0, 0], // example values
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(238, 122, 26, 0.7)'
            ],
            borderColor: 'white',
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    }
});

// Initial load
showTranHistory(transaction, transaction.length);
dashboard();
updateChart();
