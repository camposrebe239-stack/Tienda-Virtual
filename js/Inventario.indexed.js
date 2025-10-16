/* ----------  CONFIG  ---------- */
const DB_NAME = 'Catalogo';
const STORE = 'productos';
const VERSION = 1;
const LIST_SEL = '#tblAdmin tbody';

let db;
let editId = null;
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

/* ----------  CRUD  ---------- */
async function crearRegistro(datos) {
    const tx = db.transaction(STORE, 'readwrite');
    const id = await tx.store.add(datos);
    await tx.done;
    return id;
}
async function leerTodos() {
    const tx = db.transaction(STORE, 'readonly');
    const list = await tx.store.getAll();
    await tx.done;
    return list;
}
async function actualizarRegistro(datos) {
    const tx = db.transaction(STORE, 'readwrite');
    await tx.store.put(datos);
    await tx.done;
}
async function borrarRegistro(id) {
    const tx = db.transaction(STORE, 'readwrite');
    await tx.store.delete(id);
    await tx.done;
}

/* ----------  PINTA TABLA  ---------- */
async function pintarLista() {
    const regs = await leerTodos();
    listaEl.innerHTML = '';
    regs.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.nombre}</td>
            <td>${p.descripcion}</td>
            <td>$${p.precio}</td>
            <td><img src="${p.img }" alt="${p.nombre}" width="80"></td>
            <td><button onclick="eliminar(${p.id})">Eliminar</button>
            </td>`;
        listaEl.appendChild(tr);
    });
}

/* ----------  FORMULARIO  ---------- */
const form= document.querySelector('#frmProductos');
form.addEventListener('submit', async e => {
    e.preventDefault();
    const datos = {
        nombre: document.querySelector('#nombre').value.trim(),
        descripcion: document.querySelector('#descripcion').value.trim(),
        precio: Number(document.querySelector('#precio').value),
        img: document.querySelector('#img').value.trim()
    };
    if (editId) datos.id = editId;

    editId ? await actualizarRegistro(datos) : await crearRegistro(datos);

    editId = null;
    form.reset();
    await pintarLista();
});

/* ----------   ELIMINAR  ---------- */
window.eliminar = async id => {
    if (confirm('¿Borrar producto?')) {
        await borrarRegistro(id);
        await pintarLista();
    }
};
/* ----------  INICIO  ---------- */
window.addEventListener('DOMContentLoaded', async () => {
    await abrirBD();
    await pintarLista();
});