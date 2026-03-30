const API_URL = 'http://localhost:3000/notes';

document.addEventListener('DOMContentLoaded', fetchHistory);

async function fetchHistory() {
    try {
        const response = await fetch(API_URL);
        const notes = await response.json();
        renderTable(notes);
    } catch (err) {
        console.error("Connection Error:", err);
    }
}

async function saveNote() {
    const input = document.getElementById('noteInput');
    const noteText = input.value.trim();

    if (!noteText) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                student_name: 'Danny', 
                content: noteText  // Matches backend 'content'
            })
        });

        if (response.ok) {
            input.value = '';     
            await fetchHistory(); 
        }
    } catch (err) {
        alert("Backend unreachable. Is Docker running?");
    }
}

function renderTable(notes) {
    const body = document.getElementById('historyTableBody');
    
    if (notes.length === 0) {
        body.innerHTML = `<tr><td colspan="3" class="text-center">No notes yet.</td></tr>`;
        return;
    }

    body.innerHTML = notes.map(note => `
        <tr class="border-b">
            <td class="p-4">#${note.id}</td>
            <td class="p-4 font-medium">${note.content}</td> <td class="p-4 text-sm">
                ${new Date(note.created_at).toLocaleTimeString()}
            </td>
        </tr>
    `).join('');
}