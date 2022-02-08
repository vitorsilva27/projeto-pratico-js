"use strict";

const openModal = () =>
document.getElementById("modal").classList.add("active");

const closeModal = () => {
  clearFields();
  document.getElementById("modal").classList.remove("active");
};

const modalReport = () => 
document.getElementById("report").classList.toggle("hide")

// Pegar
const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("db_people")) ?? [];

//Enviar
const setLocalStorage = (dbPeople) =>
  localStorage.setItem("db_people", JSON.stringify(dbPeople));

// CRUD - CREATE
const createPeople = (people) => {
  const dbPeople = getLocalStorage();
  dbPeople.push(people);
  setLocalStorage(dbPeople);
};

// CRUD - READ
const readPeople = () => getLocalStorage();

// CRUD - UPDATE
const updatePeople = (index, people) => {
  const dbPeople = readPeople();
  dbPeople[index] = people;
  setLocalStorage(dbPeople);
};

// CRUD - DELETE
const deletePeople = (index) => {
  const dbPeople = readPeople();
  dbPeople.splice(index, 1);
  setLocalStorage(dbPeople);
};

const isValidFields = () => {
  return document.getElementById("form").reportValidity();
};

const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
};

// Interação com o Layout
const savePeople = () => {
  if (isValidFields()) {
    const people = {
      name: document.getElementById("name").value,
      age: document.getElementById("age").value,
      gender: document.getElementById("gender").value,
      place: document.getElementById("place").value,
    };
    const index = document.getElementById("name").dataset.index;
    if (index == "new") {
      createPeople(people);
      updateTable();
      closeModal();
    } else {
      updatePeople(index, people);
      updateTable();
      closeModal();
    }
  }
};

const createRow = (people, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
        <td>${people.name}</td>
        <td>${people.age}</td>
        <td>${people.gender}</td>
        <td>${people.place}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">editar</button>
            <button type="button" class="button red" id="delete-${index}">excluir</button>
        </td>
    `;
  document.querySelector("#tablePeople>tbody").appendChild(newRow);
};

const clearTable = () => {
  const rows = document.querySelectorAll("#tablePeople>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  const dbPeople = readPeople();
  clearTable();
  dbPeople.forEach(createRow);
};

const fillFields = (people) => {
  document.getElementById("name").value = people.name;
  document.getElementById("age").value = people.age;
  document.getElementById("gender").value = people.gender;
  document.getElementById("place").value = people.place;
  document.getElementById("name").dataset.index = people.index;
};

const editPeople = (index) => {
  const people = readPeople()[index];
  people.index = index;
  fillFields(people);
  openModal();
};

const editDelete = (event) => {
  if (event.target.type == "button") {
    const [action, index] = event.target.id.split("-");

    if (action === "edit") {
      editPeople(index);
    } else {
      const people = readPeople()[index];
      const response = confirm(`Deseja Realmente Excluir ${people.name} ?`);
      if (response) {
        deletePeople(index);
        updateTable();
      }
    }
  }
};

updateTable();

// EVENTOS
document.getElementById("registerPerson").addEventListener("click", openModal);

document.getElementById("generateReport").addEventListener("click", modalReport);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("cancel").addEventListener("click", closeModal);

document.getElementById("save").addEventListener("click", savePeople);

document.querySelector("#tablePeople>tbody").addEventListener("click", editDelete);
