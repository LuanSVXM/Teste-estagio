var db;
window.addEventListener('load', iniciar())

function iniciar() {
    var porta = window.indexedDB.open("Filmes", "2");
    porta.onsuccess = function(e) {
        db = e.target.result
        var dados = []
        var porta = window.indexedDB.open("Filmes", "2");
        var limpeza = document.querySelector('#filmes').children[0].children[1].querySelectorAll('tr')
        if (limpeza.length != 0) {
            document.querySelector('#filmes').children[0].children[1].innerHTML = '';
        }
        var tabela = document.querySelector('#filmes').children[0].children[1];
        var escrever = db.transaction(["filmes"])
        var objectStore = escrever.objectStore("filmes");
        var request = objectStore.openCursor();
        request.onsuccess = function(e) {
            var cursor = e.target.result;
            if (cursor) {
                dados.push(cursor.value);
                cursor.continue();
            } else {
                for (i = 0; i < dados.length; i++) {
                    var tr = document.createElement('tr')
                    var td1 = document.createElement('td')
                    var td2 = document.createElement('td')
                    var td3 = document.createElement('td')
                    var td4 = document.createElement('td')
                    var td5 = document.createElement('button')
                    var td6 = document.createElement('button')
                    td1.textContent = dados[i].nome
                    td2.textContent = dados[i].resumo
                    td3.textContent = dados[i].nota
                    td4.textContent = dados[i].data
                    td5.id = dados[i].id;
                    td5.textContent = 'remover';
                    td6.textContent = 'modificar';
                    td6.id = dados[i].id;
                    td5.setAttribute('onclick', 'apagar(this)');
                    td6.setAttribute('onclick', 'modificar(this)');
                    td5.setAttribute('class', 'buttonac');
                    td6.setAttribute('class', 'buttonac');
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    tr.appendChild(td5);
                    tr.appendChild(td6);
                    tabela.appendChild(tr);
                }
            }
        }
    }
    porta.onerror = function(e) {
        console.log("abrio sem sucesso")
    }
    porta.onupgradeneeded = function(e) {
        var db = e.target.result;
        var objetos = db.createObjectStore("filmes", {
            keyPath: "id",
            autoIncrement: true
        })
        console.log(db)
    }
}

function enviar() {
    console.log(db);
    console.log('entro');
    var button = document.querySelector('#enviar').parentNode.querySelectorAll('input');
    console.log(button);
    var escrever = db.transaction(["filmes"], "readwrite").objectStore("filmes");
    var objeto = escrever.add({
        nome: button[0].value,
        resumo: button[1].value,
        nota: button[2].value,
        data: button[3].value
    });
    window.location.reload();
}


function apagar(button) {
    var database = db.transaction(['filmes'], 'readwrite').objectStore('filmes').delete((button.id) * 1);
    database.onsuccess = function(event) {
        button.parentNode.innerHTML = '';
    };

}

function ligar_desligar() {}

function modificar(button) {
    let button2 = button.parentNode.querySelectorAll('td');

    let dados = document.querySelectorAll('.inputdp');
    for (let i = 0; i < button2.length; i++) {
        dados[i].value = button2[i].textContent
    }
    dados[0].id = button.id
    document.querySelector('#enviar').removeAttribute('onclick', 'enviar()')
    document.querySelector('#enviar').setAttribute('onclick', 'modificar2(this)')
    console.log(document.querySelector('#enviar').setAttribute('onclick', 'modificar2(this)'))
    document.querySelector('#enviar').textContent = 'modificar';
    document.querySelector('.invi').hidden = false;
};

function modificar2(e) {
    let eu = e.parentNode.querySelectorAll('input');
    var escrever = db.transaction(["filmes"], 'readwrite')
    var objectStore = escrever.objectStore("filmes")
    var trocar = objectStore.get((eu[0].id) * 1)

    trocar.onsuccess = function(e) {
        let bb = (eu[0].id) * 1
        let update = {
            id: bb,
            nome: eu[0].value,
            resumo: eu[1].value,
            nota: eu[2].value,
            data: eu[3].value,

        }
        objectStore.put(update);
        document.querySelector('#enviar').removeAttribute('onclick', 'modificar2(this)');
        document.querySelector('#enviar').setAttribute('onclick', 'enviar()');
        window.location.reload();
    }
    trocar.onerror = function() {
        document.querySelector('.invi').hidden = true;
        console.log('deu erro')
    }

}
let button = document.querySelector('#inviar')
button.addEventListener('click', function() {
    let dados = document.querySelectorAll('.inputdp');
    for (let i = 0; i < dados.length; i++) {
        dados[i].value = '';
    }
    document.querySelector('#enviar').textContent = 'enviar';
    document.querySelector('#enviar').removeAttribute('onclick', 'modificar2(this)');
    document.querySelector('#enviar').setAttribute('onclick', 'enviar()');
    document.querySelector('.invi').hidden = false;
})
document.querySelector('.sair').addEventListener('click', function() {
    document.querySelector('.invi').hidden = true;
})