/* ----------  CONFIG  ---------- */
const DB_NAME = 'Catalogo';
const STORE = 'productos';
const VERSION = 1;
const LIST_SEL = '#tblCatalogo';

let db;
const listaEl = document.querySelector(LIST_SEL);

/* ----------  ABRE BD  ---------- */
async function abrirBD() {
    db = await idb.openDB(DB_NAME, VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE)) {
                db.createObjectStore(STORE, {keyPath: 'id', autoIncrement: true});
            }
        }
    });
}

/* ----------  LEE TODOS  ---------- */
async function leerTodos() {
    const tx = db.transaction(STORE, 'readonly');
    return await tx.store.getAll();
}

/* ----------  PINTA TABLA  ---------- */
async function pintarLista() {
    const regs = await leerTodos();
    listaEl.innerHTML = '';
    regs.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${p.img || 'img/sin-imagen.png'}" alt="${p.nombre}" width="80"></td>
            <td>${p.nombre}</td>
            <td>${p.descripcion}</td>
            <td>$${Number(p.precio).toFixed(2)}</td>`;
        listaEl.appendChild(tr);
    });
}

/* ----------  FILTRO  ---------- */
function filtrarProd() {
    const filtro = document.getElementById('Buscador').value.trim().toLowerCase();
    const filas  = listaEl.querySelectorAll('tr');
    filas.forEach(tr => {
        const txt = tr.cells[1]?.textContent.toLowerCase() || '';
        tr.style.display = txt.includes(filtro) ? '' : 'none';
    });
}

/* ----------  INICIO  ---------- */
window.addEventListener('DOMContentLoaded', async () => {
    await abrirBD();
    await pintarLista();
    document.getElementById('Buscador').addEventListener('input', filtrarProd);
});