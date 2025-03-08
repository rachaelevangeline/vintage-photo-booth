const form = document.getElementById('messageForm');
const nameInput = document.getElementById('nameInput');
const messageInput = document.getElementById('messageInput');
const stickyBoard = document.getElementById('stickyBoard');

// Load existing messages from localStorage
window.onload = function() {
    const messages = JSON.parse(localStorage.getItem('stickyNotes')) || [];
    messages.forEach(message => addStickyNote(message.name, message.message));
}

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (name && message) {
        addStickyNote(name, message);
        saveMessage(name, message);
        form.reset();
    }
});

function addStickyNote(name, message) {
    const stickyNote = document.createElement('div');
    stickyNote.className = 'sticky-note';
    stickyNote.innerHTML = `
        <p>${message}</p>
        <span class="note-author">— ${name}</span>
    `;
    stickyBoard.appendChild(stickyNote);
}

function saveMessage(name, message) {
    const messages = JSON.parse(localStorage.getItem('stickyNotes')) || [];
    messages.push({ name, message });
    localStorage.setItem('stickyNotes', JSON.stringify(messages));
}
