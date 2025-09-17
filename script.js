const API_URL = 'http://localhost:3000/dioses';

const godListJson = document.getElementById('god-list');
const form = document.getElementById('god-form');
const nameInput = document.getElementById('god-name');
const domainInput = document.getElementById('god-domain');
const symbolInput = document.getElementById('god-symbol');
const powerInput = document.getElementById('god-power');
const saveButton = document.getElementById('god-save-btn');

const attributeInput = document.getElementById('god-attr');
const attributeFetchButton = document.getElementById('god-fetch-attr-btn');
const switchButton = document.getElementById('god-toggle-view');

let editingGodId = null;
let showSimple = false;

// GET
async function getGods() {
  const response = await fetch(API_URL);
  const gods = await response.json();

  godListJson.innerHTML = '';
  
  gods.forEach(god => {
    const data = showSimple 
      ? { id: god.id, nombre: god.nombre, dominio: god.dominio } 
      : god;

    const godItem = document.createElement('div');
    godItem.className = 'god-item';

    const dataDiv = document.createElement('div');
    dataDiv.className = 'god-data';
    dataDiv.textContent = JSON.stringify(data, null, 2);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'god-buttons';

    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.className = 'btn-edit';

    editButton.addEventListener('click', () => {
      editingGodId = god.id;
      nameInput.value = god.nombre;
      domainInput.value = god.dominio;
      symbolInput.value = god.simbolo || '';
      powerInput.value = god.poder || '';
      saveButton.textContent = 'Actualizar dios';
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.className = 'btn-delete';

    deleteButton.addEventListener('click', async () => {
      await deleteGod(god.id);
      getGods();
    });

    buttonsDiv.append(editButton, deleteButton);
    godItem.append(dataDiv, buttonsDiv);
    godListJson.appendChild(godItem);
  });
}

// POST
async function createGod(god) {
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(god)
  });
}

// PUT
async function updateGod(id, god) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(god)
  });
}

// DELETE
async function deleteGod(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}

// Form submit
form.addEventListener('submit', async e => {
  e.preventDefault();

  const god = {
    nombre: nameInput.value,
    dominio: domainInput.value,
    simbolo: symbolInput.value,
    poder: powerInput.value
  };

  if (editingGodId) {
    await updateGod(editingGodId, god);
    editingGodId = null;

    saveButton.textContent = 'Agregar dios';
  } else {
    await createGod(god);
  }

  form.reset();
  getGods();
});

// Switch simple/completo
switchButton.addEventListener('click', () => {
  showSimple = !showSimple;
  switchButton.textContent = showSimple
    ? 'Mostrar todos los atributos de los dioses'
    : 'Mostrar solo nombre y dominio de dioses';
  getGods();
});

// Mostrar solo un atributo
attributeFetchButton.addEventListener('click', async () => {
  const attribute = attributeInput.value.trim();

  if (!attribute) 
    return alert('Ingresá un atributo');
  else if (!['nombre', 'dominio', 'simbolo', 'poder'].includes(attribute))
    return alert('Atributo inválido. Usá: nombre, dominio, simbolo o poder');

  const res = await fetch(API_URL);
  const gods = await res.json();

  godListJson.innerHTML = '';

  gods.forEach(god => {
    if (god[attribute] !== undefined) {
      const godItem = document.createElement('div');
      godItem.className = 'god-item';

      const dataDiv = document.createElement('div');
      dataDiv.className = 'god-data';
      dataDiv.textContent = JSON.stringify({ [attribute]: god[attribute] }, null, 2);

      const buttonsDiv = document.createElement('div');
      buttonsDiv.className = 'god-buttons';

      const editButton = document.createElement('button');
      editButton.textContent = 'Editar';
      editButton.className = 'btn-edit';
      editButton.addEventListener('click', () => {
        editingGodId = god.id;
        nameInput.value = god.nombre;
        domainInput.value = god.dominio;
        symbolInput.value = god.simbolo || '';
        powerInput.value = god.poder || '';
        saveButton.textContent = 'Actualizar dios';
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Eliminar';
      deleteButton.className = 'btn-delete';
      deleteButton.addEventListener('click', async () => {
        await deleteGod(god.id);
        getGods();
      });

      buttonsDiv.append(editButton, deleteButton);
      godItem.append(dataDiv, buttonsDiv);
      godListJson.appendChild(godItem);
    }
  });
});

// Llamada inicial
getGods();
