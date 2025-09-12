// URL base del API de json-server
const API_URL = 'http://localhost:3000/extraterrestres';

// Variable global para manejar el estado de edición
let editingId = null;

// Elementos del DOM
const tableData = document.getElementById('alien-table-data');
const nameInput = document.getElementById('name');
const planetInput = document.getElementById('planet');
const powerInput = document.getElementById('power');
const saveButton = document.getElementById('save-alien-button');
const form = document.getElementById('alien-form');

// GET: obtener todos los extraterrestres
async function getAllAliens() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok)
      throw new Error('Error al obtener los extraterrestres');

    const aliens = await response.json();

    tableData.innerHTML = '';

    aliens.forEach(alien => {
      tableData.innerHTML += `
        <tr>
          <td>${alien.id}</td>
          <td>${alien.nombre}</td>
          <td>${alien.planeta}</td>
          <td>${alien.nivelPoder}</td>
          <td>
            <button class="edit-alien-button"
              data-id="${alien.id}"
              data-nombre="${alien.nombre}"
              data-planeta="${alien.planeta}"
              data-poder="${alien.nivelPoder}">Editar
            </button>
            <button class="delete-alien-button" data-id="${alien.id}">Eliminar</button>
          </td>
        </tr>`;
    });
  } catch (error) {
    console.error(error);
  }
}

// POST: crear nuevo extraterrestre
async function postAlien(alienData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alienData)
    });

    if (!response.ok)
      throw new Error('Error al crear el extraterrestre');

    await response.json();
  } catch (error) {
    console.error(error);
  }
}

// PUT: actualizar extraterrestre existente
async function updateAlien(id, alienData) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alienData)
    });

    if (!response.ok)
      throw new Error('Error al actualizar el extraterrestre');

    await response.json();
  } catch (error) {
    console.error(error);
  }
}

// DELETE: eliminar extraterrestre
async function deleteAlien(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

    if (!response.ok)
      throw new Error(`Error al eliminar el extraterrestre con id: ${id}`);
  } catch (error) {
    console.error(error);
  }
}

// Cargar datos en el formulario para editar
function editAlien(id, nombre, planeta, poder) {
  editingId = id;
  nameInput.value = nombre;
  planetInput.value = planeta;
  powerInput.value = poder;
  saveButton.textContent = 'Actualizar extraterrestre';
}

// Manejar botones de editar y eliminar
tableData.addEventListener('click', async e => {
  const target = e.target;

  if (target.classList.contains('edit-alien-button')) {
    const { id, nombre, planeta, poder } = target.dataset;

    editAlien(id, nombre, planeta, poder);
  }

  if (target.classList.contains('delete-alien-button')) {
    const { id } = target.dataset;

    await deleteAlien(id);

    getAllAliens();
  }
});

// Manejar envío del formulario
form.addEventListener('submit', async e => {
  e.preventDefault();

  const alien = {
    nombre: nameInput.value,
    planeta: planetInput.value,
    nivelPoder: powerInput.value
  };

  if (editingId) {
    await updateAlien(editingId, alien);

    editingId = null;
  } else {
    await postAlien(alien);
  }

  form.reset();
  getAllAliens();
});

// Cargar tabla inicial
getAllAliens();
