const API_KEY = 'ef66e4fffbmshc4ad32b653ea502p1c9116jsnef1759373801';
const API_HOST = 'free-tempmail-api.p.rapidapi.com';

let currentEmail = "";
let readMessages = []; // Untuk Tab Inbox
let unreadMessages = []; // Untuk Tab Updates

// Fungsi Ganti Tab
function switchTab(tabId, el) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    el.classList.add('active');
}

async function apiFetch(endpoint) {
    const res = await fetch(`https://${API_HOST}${endpoint}`, {
        method: 'GET',
        headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': API_HOST }
    });
    return await res.json();
}

async function generateEmail() {
    document.getElementById('email-text').innerText = "Generating...";
    const data = await apiFetch('/api/v1/generate');
    currentEmail = data.email;
    document.getElementById('email-text').innerText = currentEmail;
}

async function checkMessages() {
    if (!currentEmail) return;
    try {
        const messages = await apiFetch(`/api/v1/messages?email=${currentEmail}`);
        if (messages.length > 0) {
            unreadMessages = messages.filter(m => !readMessages.find(rm => rm.id === m.id));
            renderUpdates();
        }
    } catch (e) { console.log("Belum ada email."); }
}

function renderUpdates() {
    const container = document.getElementById('unread-messages-list');
    if (unreadMessages.length === 0) return;

    container.innerHTML = "";
    unreadMessages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'email-box-card'; // Pakai style card
        div.style.textAlign = 'left';
        div.style.cursor = 'pointer';
        div.innerHTML = `<strong>${msg.from}</strong><br><small>${msg.subject}</small>`;
        div.onclick = () => openEmail(msg);
        container.appendChild(div);
    });
}

function openEmail(msg) {
    // Pindahkan ke read
    if (!readMessages.find(m => m.id === msg.id)) {
        readMessages.push(msg);
        renderInbox();
    }
    // Logika buka modal isi email (sama seperti sebelumnya)
    alert("Membuka email dari: " + msg.from + "\nIsi: " + msg.subject);
}

function renderInbox() {
    const container = document.getElementById('read-messages-list');
    document.querySelector('#inbox .empty-state').style.display = 'none';
    container.innerHTML = "";
    readMessages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'email-box-card';
        div.innerHTML = `<strong>${msg.from}</strong><br><small>${msg.subject}</small>`;
        container.appendChild(div);
    });
}

function copyEmail() {
    const text = document.getElementById('email-text').innerText;
    navigator.clipboard.writeText(text);
    alert("Email disalin!");
}

// Init
generateEmail();
setInterval(checkMessages, 5000);
