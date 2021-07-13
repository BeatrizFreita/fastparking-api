'use strict';

const date = new Date();
const dateTime = {
    'day': date.getDate(),
    'mounth': date.getMonth() + 1,
    'year': date.getFullYear(),
    'hours': date.getHours(),
    'minutes': date.getMinutes()
}

const openModalPrecos = () => document.querySelector('#modal-preco').classList.add('active');
const closeModalPrecos = () => document.querySelector('#modal-preco').classList.remove('active');

const openModalReceipt = () => document.querySelector('#modal-comprovante').classList.add('active');
const closeModalReceipt = () => document.querySelector('#modal-comprovante').classList.remove('active');

const openModalExit = () => document.querySelector('#modal-saida').classList.add('active');
const closeModalExit = () => document.querySelector('#modal-saida').classList.remove('active');

const openModalEdit = () => document.querySelector('#modal-editar').classList.add('active');
const closeModalEdit = () => document.querySelector('#modal-editar').classList.remove('active');

const readDBFastParking = () => JSON.parse(localStorage.getItem('dbFastParking')) ?? [];
const setDBFastParking = (dbFastParking) => localStorage.setItem('dbFastParking', JSON.stringify(dbFastParking));

const readDBPrecos = () => JSON.parse(localStorage.getItem('precos')) ?? [];
const setDBPrecos = (dbPrecos) => localStorage.setItem('precos', JSON.stringify(dbPrecos));

const insertIntoDBFastParking = (car) => {
    const dbFastParking = readDBFastParking();
    dbFastParking.push(car);
    setDBFastParking(dbFastParking);
}

const insertIntoDBPrecos = (precos) => {
    const dbPrecos = readDBPrecos()
    dbPrecos.push(precos)
    setDBPrecos(dbPrecos)
}

const getDateNow = () => {
    const dateNow = dateTime['mounth'] > 9 ?
        dateTime['day'] + '/' + dateTime['mounth'] + '/' + dateTime['year']
        :
        dateTime['day'] + '/0' + dateTime['mounth'] + '/' + dateTime['year'];

    return dateNow;
}

const getHoursNow = () => {
    const timeNow = dateTime['hours'] + ':' + dateTime['minutes'];

    return timeNow;
}

const clearTable = () => {
    const recordCar = document.querySelector('#tabelaClientes tbody');
    while (recordCar.firstChild) {
        recordCar.removeChild(recordCar.lastChild);
    }
}

const clearInputs = () => {
    const inputs = Array.from(document.querySelectorAll('input'));
    inputs.forEach(input => input.value = "");
}


const createRow = (car, index) => {
    const tabelaClientes = document.querySelector('#tabelaClientes tbody')
    const newTr = document.createElement('tr');

    newTr.innerHTML = `
        <td>${car.nome}</td>
        <td>${car.placa}</td>
        <td>${car.data}</td>
        <td>${car.hora}</td>
        <td>
            <button data-index="${index}" id="button-receipt" class="button green" type="button">Comp.</button>
            <button data-index="${index}" id="button-edit" class="button pink" type="button">Editar</button>
            <button data-index="${index}" id="button-exit" class="button pinkred" type="button">Saída</button>
        </td>`;

    tabelaClientes.appendChild(newTr);
}

const updateTable = () => {
    clearTable()
    const dbFastParking = readDBFastParking();
    dbFastParking.forEach(createRow)
}

const isValidFormRegister = () => document.querySelector('#form-register').reportValidity();

const saveCar = () => {
    if (isValidFormRegister()) {
        const newCar = {
            nome: document.querySelector('#nome').value,
            placa: document.querySelector('#placaCarro').value,
            data: getDateNow(),
            hora: getHoursNow()
        }
        insertIntoDBFastParking(newCar);
        clearInputs();
        updateTable();
    }
}

const isValidFormPrecos = () => document.querySelector('#form-precos').reportValidity();


const savePrecos = () => {
    if (isValidFormPrecos()) {
        const newPrecos = {
            primeiraHora: document.querySelector('#hora-preco').value,
            demaisHoras: document.querySelector('#apos-uma-hora').value
        }
        insertIntoDBPrecos(newPrecos);
        clearInputs();
        closeModalPrecos();
    }
}

const savePrice = () => {

    const dbPrice = readDBPrice()

    if (isValidFormPrice()) {

        const price = {
            onehourPrice: document.querySelector('#hora-preco').value,
            otherHoursPrice: document.querySelector('#apos-uma-hora').value
        }

        if (dbPrice == '') {

            insertDBPrice(price)
        } else {
            dbPrice[0] = price
            setDBPrice(dbPrice)
        }

        closeModalPrice()
    }
}

const showModalPrice = () => {

    const dbPrice = readDBPrice()

    document.querySelector('#hora-preco').value = dbPrice[0].onehourPrice
    document.querySelector('#apos-uma-hora').value = dbPrice[0].otherHoursPrice
}

const isValidFormEdit = () => document.querySelector('#form-editar').reportValidity();

const saveCarEdited = () => {
    if (isValidFormEdit()) {
        const newCar = {
            nome: document.querySelector('#nome-edited').value,
            placa: document.querySelector('#editar-placa').value,
            data: document.querySelector('#data').value,
            hora: document.querySelector('#hora').value
        }

        insertIntoDBFastParking(newCar);
        clearInputs();
        closeModalEdit();
        updateTable();
    }
}

const calcExit = (index) => {

    const dbFastParking = readDBFastParking();
    const dbPrecos = readDBPrecos();
    const lastIndex = dbPrecos.length - 1;

    const valueOfFirsteHours = dbPrecos[lastIndex]["hora-preco"];
    const valueOfMoreHours = dbPrecos[lastIndex]["apos-uma-hora"];

    const entryTime = dbFastParking[index].hora.substr(0, 2);
    let exitTime = getHoursNow().substr(0, 2);
    let valueOfBePay = 0

    if (exitTime == '0:') {
        exitTime = 24;
        let totalHoursParked = parseInt(entryTime) - parseInt(exitTime);
        if (totalHoursParked < 0) {
            totalHoursParked *= -1;
        }
        if (totalHoursParked > 1) {

            const moreHours = totalHoursParked - 1;
            const valueOfBePayMoreHours = moreHours * valueOfMoreHours;
            const valueOfBePay = parseInt(valueOfBePayMoreHours) + parseInt(valueOfFirsteHours);
            console.log(valueOfBePay);

        } else {
            valueOfBePay = valueOfFirsteHours;
        }

    } else {

        let totalHoursParked = parseInt(entryTime) - parseInt(exitTime);
        if (totalHoursParked < 0) {

            totalHoursParked *= -1;
        }
        if (totalHoursParked > 1) {

            const moreHours = totalHoursParked - 1;
            const valueOfBePayMoreHours = moreHours * valueOfMoreHours;
            valueOfBePay = parseInt(valueOfBePayMoreHours) + parseInt(valueOfFirsteHours);
        } else {

            valueOfBePay = valueOfFirsteHours;
   
        }
    
    }
    return valueOfBePay;
}

const deleteCar = (index) => {
    const dbFastParking = readDBFastParking()
    const resp = confirm(`Ao confirmar os dado de ${dbFastParking[index].nome} serão apagados ou editados?`);

    if (resp) {
        dbFastParking.splice(index, 1)
        setDBFastParking(dbFastParking);
        updateTable();
    }
}

const setReceipt = (index) => {
    const dbFastParking = readDBFastParking();
    const input = Array.from(document.querySelectorAll('#form-recibo input'));
    input[0].value = dbFastParking[index].nome;
    input[1].value = dbFastParking[index].placa;
    input[2].value = dbFastParking[index].data;
    input[3].value = dbFastParking[index].hora;
}

const setExit = (index) => {

    const dbFastParking = readDBFastParking();
    const input = Array.from(document.querySelectorAll('#form-saida input'));
    input[0].value = dbFastParking[index].nome;
    input[1].value = dbFastParking[index].placa;
    input[2].value = dbFastParking[index].hora;
    input[3].value = getHoursNow();
    input[4].value = calcExit(index);
    deleteCar(index);

}

const editCar = (index) => {

    const dbFastParking= readDBFastParking();
    document.querySelector('#nome-edited').value = dbFastParking[index].nome;
    document.querySelector('#editar-placa').value = dbFastParking[index].placa;
    document.querySelector('#data').value = dbFastParking[index].data;
    document.querySelector('#hora').value = dbFastParking[index].hora;
    deleteCar(index);
}

const getButtons = (event) => {

    const button = event.target;
    if (button.id == "button-receipt") {

        const index = button.dataset.index;
        openModalReceipt();
        setReceipt(index);
    } else if (button.id == "button-exit") {

        const index = button.dataset.index;
        openModalExit();
        setExit(index);
    } else if (button.id == "button-edit") {

        const index = button.dataset.index;
        openModalEdit();
        editCar(index);
    }

}

const printRecipt = () => {
    window.print();
}

document.querySelector('#btnPreco').addEventListener('click', () => { openModalPrecos(); clearInputs() });
document.querySelector('#fechar-preco').addEventListener('click', () => { closeModalPrecos(); clearInputs() });
document.querySelector('#cancelar-preco').addEventListener('click', () => { closeModalPrecos(); clearInputs() });



document.querySelector('#tabelaClientes').addEventListener('click', getButtons);



document.querySelector('#fechar-rebibo').addEventListener('click', () => { closeModalReceipt(); clearInputs() });
document.querySelector('#cancelar-recibo').addEventListener('click', () => { closeModalReceipt(); clearInputs() });


document.querySelector('#close-exit').addEventListener('click', () => { closeModalExit(); clearInputs() });
document.querySelector('#cancelar-exit').addEventListener('click', () => { closeModalExit(); clearInputs() });

document.querySelector('#close-edit').addEventListener('click', () => { closeModalEdit(); clearInputs() });
document.querySelector('#cancelar-edit').addEventListener('click', () => { closeModalEdit(); clearInputs() });


document.querySelector('#btnSalvar').addEventListener('click', saveCar);


document.querySelector('#btnPreco')
.addEventListener('click', () => { openModalPrice(); showModalPrice() })

document.querySelector('#hora-preco')
    .addEventListener('keyup', applyMask)

document.querySelector('#apos-uma-hora')
    .addEventListener('keyup', applyMask)

document.querySelector('#salvar-preco').addEventListener('click', savePrecos);


document.querySelector('#editar-salvar').addEventListener('click', saveCarEdited);


document.querySelector('#imprimir-recibo').addEventListener('click', printRecipt)
document.querySelector('#imprimir-saida').addEventListener('click', printRecipt)
updateTable();