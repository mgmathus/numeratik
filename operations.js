var data = {
    qty: 10,
    cols: 2,
    allow_negatives_answers_subs: false,
    operations: [
        {
            id: 1,
            label: "Additions",
            symbol: '+',
            selected: true
        },
        {
            id: 2,
            label: "Substractions",
            symbol: '-',
            selected: false
        },
        {
            id: 3,
            label: "Multiplications",
            symbol: 'x',
            selected: false
        }
    ]
};

var lastOperator = 0;

function buildOperations() {
    var [firstMin, firstMax, secondMin, secondMax] = [document.getElementById("firstMin").value, document.getElementById("firstMax").value, document.getElementById("secondMin").value, document.getElementById("secondMax").value];
    [firstMin, firstMax, secondMin, secondMax] = [parseInt(firstMin), parseInt(firstMax), parseInt(secondMin), parseInt(secondMax)];

    this.data.qty = document.getElementById("qty").value;
    this.data.operations[0].selected = document.getElementById("adds").checked;
    this.data.operations[1].selected = document.getElementById("subs").checked;
    this.data.operations[2].selected = document.getElementById("product").checked;

    if (!this.data.operations[0].selected && !this.data.operations[1].selected && !this.data.operations[2].selected) {
        alert("Selecciona al menos una operaci\u00F3n");
        return false;
    }

    this.data.allow_negatives_answers_subs = document.getElementById("negatives").checked;

    if (data.qty < 1) {
        alert("Cantidad de operaciones no permitida");
        return false;
    }

    let problems = [];
    let nextOperator = 0;
    let printed = 0;

    while (printed <= data.qty) {
        if (data.operations[this.lastOperator].selected) {
            nextOperator = data.operations[this.lastOperator].symbol;
            let fo = this.getRandomInteger(firstMin + 1, firstMax + 1);
            let so = this.getRandomInteger(secondMin + 1, secondMax + 1);

            if (!data.allow_negatives_answers_subs && nextOperator === '-' && fo < so) {
                fo = so;
                so = fo;
            }

            let currentOperation = {
                firstOperator: this.format(fo),
                secondOperator: this.format(so),
                operation: nextOperator
            };

            problems.push(currentOperation);
            printed++;
        }
        this.lastOperator = (parseInt(lastOperator) + 1) > data.operations.length - 1 ? 0 : parseInt(lastOperator) + 1;
    }
    this.addTable(problems, data.cols);
}

function getRandomInteger(min, max) {
    if ((max - min) == 1 || (max - min) < 0) {
        return Math.floor(Math.random() * (max));
    }
    let r = Math.floor(Math.random() * (max - min)) + min;
    return r;
}

function addTable(generated, cols) {
    document.getElementById("myProblemsToSolve").innerHTML = "";
    lastOperator = 0;
    var tableDiv = document.getElementById("myProblemsToSolve");

    var table = document.createElement('DIV');
    var tableBody = document.createElement('DIV');
    table.className = "col";
    table.appendChild(tableBody);
    let k = 0;
    while (generated.length > k) {
        var tr = document.createElement('DIV');
        tr.className = "row";
        tableBody.appendChild(tr);
        for (var j = 0; j < cols; j++) {
            var td = document.createElement('DIV');
            td.className = "col";
            td.appendChild(appendData(generated, k));
            tr.appendChild(td);
            k++;
        }
    }
    var pbr = document.createElement('DIV');
    pbr.className = "row footspace";

    var pb = document.createElement('DIV');
    pb.className = "col d-flex justify-content-center";

    var b = document.createElement('DIV');
    b.className = "form-control btn btn-secondary";

    b.type = "button";
    b.onclick = function () { print(); };
    b.innerHTML = "Imprimir";

    pb.appendChild(b);
    pbr.appendChild(pb);

    tableDiv.appendChild(table);
    tableDiv.appendChild(pbr);

}

function appendData(generated, k) {
    var div = document.createElement("div");
    div.className = "row";
    if (generated.length > k) {
        div.innerHTML = '<div class="operation col-12">' + generated[k].firstOperator + '</div>' + '<div class="operation col-12">' + generated[k].operation + ' ' + '<u>' + generated[k].secondOperator + '</u></div><br><br>';
    }
    return div;
}

function format(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}