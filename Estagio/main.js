var db;

function iniciar() {
    var porta = window.indexedDB.open("Filmes", "2");
    porta.onsuccess = function(e) {
        db = e.target.result
        console.log('abriu')
    }
    porta.onerror = function(e) {
        console.log("abrio sem sucesso")
    }
    porta.onupgradeneeded = function(e) {
        var db = e.target.result;
        var objetos = db.createObjectStore("filmes", { keyPath: "id", autoIncrement: true })
        console.log(db)
    }

}

function enviar() {
    console.log(db);
    console.log('entro');
    var button = document.querySelector('#enviar').parentNode.querySelectorAll('input');
    console.log(button);
    var escrever = db.transaction(["filmes"], "readwrite").objectStore("filmes");
    var objeto = escrever.add({ nome: button[0].value, resumo: button[1].value, nota: button[2].value, data: button[3].value });

}

function carregardados() {
    var dados = []
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
                td1.textContent = dados[i].nome
                td2.textContent = dados[i].resumo
                td3.textContent = dados[i].nota
                td4.textContent = dados[i].data
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tabela.appendChild(tr);
            }
        }
    }
}

function apagar() {
    var objectStore = db.transaction("filmes").objectStore("filmes");

    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            alert("O nome do SSN " + cursor.key + " é " + cursor.value.name);
            cursor.continue();
        } else {
            alert("Não existe mais registros!");
        }
    };
}
window.addEventListener('load', iniciar())