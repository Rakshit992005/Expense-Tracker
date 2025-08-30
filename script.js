
let transection = new Array();


// Type select
let typeSelect = document.querySelector('select[name="type"]');

// Amount input
let amountInput = document.querySelector('input[type="number"]');

// Category select
let categorySelect = document.querySelector('select[name="category"]');

// Date input
let dateInput = document.querySelector('input[type="date"]');

// Note input
let noteInput = document.querySelector('input[placeholder="Add note (optional)"]');

// Button
let addBtn = document.querySelector('.btn');

// Whole form
let form = document.querySelector('form');

const list = document.querySelector(".list");

function showTranHistory(arr , limit) {
    list.innerHTML = "";
    const h = document.createElement("h1");
    h.textContent = "transection History";
    list.append(h);
    for(let j=0;j<limit;j++){
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

        element.classList.add("element" , "cap")
        inDetails.classList.add("in-details");
        element.appendChild(inDetails);

        img.setAttribute("src", "https://cdn-icons-png.flaticon.com/128/857/857681.png")
        div1.appendChild(img);
        inDetails.appendChild(div1);

        span1.classList.add("note");
        span1.textContent = i.note;
        div2.appendChild(span1);
        div2.appendChild(br);

        span2.classList.add("category" , "cap");
        span2.textContent = i.category;
        span3.classList.add("date");
        span3.textContent = "  "+ i.date;
        span2.appendChild(span3);
        div2.appendChild(span2);
        inDetails.appendChild(div2);

        // span4.classList.add(amo);
        if (i.type == "Income") {
            span4.classList.add("green");
            span4.classList.remove("red");
            span4.textContent = "+" + i.amount;
        } else {
            span4.classList.add("red");
            span4.classList.remove("green");
            span4.textContent = "-" + i.amount;
        }
        span4.classList.add("font")
        div3.appendChild(span4);
        element.appendChild(div3);

        list.appendChild(element);


    }
}

function dashbord() {
    let incomeArr = transection.filter((tran) => {
        return tran.type === "Income";
    })
    let expenseArr = transection.filter((tran) => {
        return tran.type === "Expense";
    });

    let inc = incomeArr.reduce((sum, t) => sum + parseInt(t.amount), 0);
    let exp = expenseArr.reduce((sum, t) => sum + parseInt(t.amount), 0);


    const bal = document.querySelector(".balance");
    const incDashbord = document.querySelector(".income");
    const expDashbord = document.querySelector(".expense");
    let balance = inc - exp;
    bal.textContent = balance;
    incDashbord.textContent = inc;
    expDashbord.textContent = exp;

    bal.classList.remove("green", "red");
    if (balance > 0) bal.classList.add("green");
    else if (balance < 0) bal.classList.add("red");

}
dashbord();

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newTra = {
        type: typeSelect.value,
        amount: amountInput.value,
        category: categorySelect.value,
        note: noteInput.value,
        date: dateInput.value
    }
    transection.unshift(newTra)
    const limit = Math.min(10 , transection.length);
    showTranHistory(transection ,limit);
    dashbord();
    categorySelector.selectedIndex = 0;
})

const search = document.querySelector(".search-inp");
search.addEventListener("input", (e) => {
    categorySelector.selectedIndex = 0;
    console.log(e);
    let filterArr = transection.filter((tran) => {
        return tran.note.toLowerCase().startsWith(search.value.toLowerCase());
    });
    showTranHistory(filterArr , filterArr.length);
});

const categorySelector = document.querySelector("#filter");
categorySelector.addEventListener("change" ,()=>{
    let categoryValue = categorySelector.value;
    console.log(categoryValue)
   if (categoryValue.toLowerCase() === "all") {
  showTranHistory(transection , transection.length);
} else {
  let filterArr = transection.filter(
    tran => tran.category.toLowerCase() === categoryValue.toLowerCase()
  );
  showTranHistory(filterArr  ,filterArr.length);
  
}
})