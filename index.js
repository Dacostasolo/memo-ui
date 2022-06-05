const notes = []

const noteItemHeader = document.querySelector('.note-item-header')
const noteItemSubHeader = document.querySelector('.note-item-sub-header')
const noteItemDate = document.querySelector('.note-item-date')
const addNoteHeader = document.querySelector('.add-note-header')
const addNoteHeaderDate = document.querySelector('.note-date-add')

//selecting input fields
const searchBar = document.querySelector('.search-inputs')
const inputAddTitle = document.querySelector('.add-title')
const inputAddContent = document.querySelector('.add-content')

//selecting buttons
const addItemButton = document.querySelector('.button-main')
const buttonBack = document.querySelector('.note-add-back')
const buttonSaveItem = document.querySelector('.note-add-check')
const editItem = document.querySelectorAll('.fa-pen')
const deleteItem = document.querySelector('.fa-check')
const selectAllButtons = document.querySelectorAll('.note-button')
const editTools = document.querySelectorAll('.edit-tool')

//selecting main containers
const displayNotesContainer = document.querySelector('.display-note')
const addNoteContainer = document.querySelector('.modal-container')
const noteItemContainer = document.querySelector('.main-body-content')

editTools.forEach((selected) => {
  if (!selected.classList.contains('reminder-add')) {
    selected.addEventListener('click', () => {
      selected.classList.toggle('edit-tool-selected')
    })
  }
})
//testing
// addItemButton

//displaying notes
const editNotesItem = (noteItem) => {
  noteItem.content.toLowerCase()
  content = noteItem.content
  if (content.split(' ').length >= 30) {
    content =
      content
        .replace(content.slice(0, 1), content.slice(0, 1).toUpperCase())
        .trim()
        .split(' ')
        .slice(0, 20)
        .join(' ') + ' ...'
  } else {
    content = content ? content : ''
  }

  header = noteItem.header
    ? noteItem.header
        .trim()
        .toLowerCase()
        .split(' ')
        .map((item) => item.replace(item[0], item[0].toUpperCase()))
        .join(' ')
    : ''
  return {
    header,
    content,
    date: noteItem.date,
  }
}

const displayNotes = (notes, isDelete) => {
  if (notes.length > 0 || isDelete) {
    noteItemContainer.innerHTML = ''
    let counter = 0
    notes.forEach((note) => {
      if ((note.header || note.content) != '') {
        const noteEdited = editNotesItem(note)
        const item = `<div class="container note-item">
              <div class="note-item-header">${noteEdited.header}</div>
              <div class="note-item-sub-header">${noteEdited.content}</div>
              <div class="note-date note-item-date">${noteEdited.date}</div>
              <div class="note-icons">
                <i class="note-button-x fas fa-xmark"></i>
                <i class="note-button-x note-button-y fas fa-pen " ></i>
              </div>
            </div>`

        noteItemContainer.insertAdjacentHTML('afterbegin', item)
      }
    })
  }
}

//delegating events to buttons not present in the dom at the dom is loaded
document.querySelector('.display-note').addEventListener('click', function (e) {
  e.preventDefault()
  if (e.target.classList.contains('note-button-y')) {
    editAddItem()
  }
  if (e.target.classList.contains('fa-xmark')) {
    const date = e.target.parentElement.previousElementSibling.textContent
    const index = notes.findIndex((note) => {
      return note.date == date
    })
    deleteItemFromList(index)
  }
})

const addNoteItem = () => {
  const header = inputAddTitle.value
  const content = inputAddContent.value
  if ((header || content) != '') {
    notes.push({ header, content, date: createDate(new Date().toISOString()) })
  }
}

//date creation
const createDate = function (date) {
  const local = navigator.language
  const options = {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }
  const now = new Date(date)
  return new Intl.DateTimeFormat(local, options).format(now)
}

//delete function
const deleteItemFromList = function (index) {
  notes.splice(index, 1)
  displayNotes(notes, true)
}

//toggling the edit menu
const editAddItem = function () {
  addNoteContainer.classList.toggle('change-display')
  displayNotesContainer.classList.toggle('change-display')
  addNoteHeaderDate.textContent = createDate(new Date().toISOString())
}

const resetInput = function () {
  inputAddContent.value = ''
  inputAddTitle.value = ''
}
//adding general functionality to the click buttons
selectAllButtons.forEach((selected) => {
  selected.addEventListener('click', (e) => {
    editAddItem()
  })
})

//saving new note
buttonSaveItem.addEventListener('click', () => {
  addNoteItem()
  displayNotes(notes)
  resetInput()
})

//search functionality
searchBar.addEventListener('keyup', function () {
  const [...nodes] = document.querySelectorAll('.note-item')
  for ([, node] of nodes.entries()) {
    const [nodeHeader, nodeContent] = node.children
    const header = nodeHeader.textContent
    const content = nodeContent.textContent
    if (
      header.concat(content).toLowerCase().includes(this.value.toLowerCase())
    ) {
      node.style.display = 'block'
    } else {
      node.style.display = 'none'
    }
  }
})
