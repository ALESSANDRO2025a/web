// Simular almacenamiento local para este ejemplo
let photos = JSON.parse(localStorage.getItem('photos')) || [];
let pendingPhotos = JSON.parse(localStorage.getItem('pendingPhotos')) || [];

document.getElementById('upload-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const guestName = document.getElementById('guest-name').value;
    const files = document.getElementById('image-input').files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function(e) {
            pendingPhotos.push({
                src: e.target.result,
                name: guestName
            });
            localStorage.setItem('pendingPhotos', JSON.stringify(pendingPhotos));
            alert('¡Foto subida con éxito! Estará visible después de ser aprobada.');
        };
        reader.readAsDataURL(file);
    }

    document.getElementById('guest-name').value = '';
    document.getElementById('image-input').value = '';
});

function displayPhotos() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    photos.forEach(photo => {
        const container = document.createElement('div');
        container.className = 'image-container';
        const img = document.createElement('img');
        img.src = photo.src;
        const p = document.createElement('p');
        p.textContent = photo.name;
        container.appendChild(img);
        container.appendChild(p);
        gallery.appendChild(container);
    });
}

function displayPendingPhotos() {
    const pendingContainer = document.getElementById('pending-photos');
    pendingContainer.innerHTML = '';
    pendingPhotos.forEach((photo, index) => {
        const div = document.createElement('div');
        div.className = 'pending-photo';
        const img = document.createElement('img');
        img.src = photo.src;
        const approveBtn = document.createElement('button');
        approveBtn.textContent = 'Aprobar';
        approveBtn.onclick = () => approvePhoto(index);
        const rejectBtn = document.createElement('button');
        rejectBtn.textContent = 'Rechazar';
        rejectBtn.onclick = () => rejectPhoto(index);
        div.appendChild(img);
        div.appendChild(approveBtn);
        div.appendChild(rejectBtn);
        pendingContainer.appendChild(div);
    });
}

function approvePhoto(index) {
    const photo = pendingPhotos.splice(index, 1)[0];
    photos.push(photo);
    updateLocalStorage();
    displayPhotos();
    displayPendingPhotos();
}

function rejectPhoto(index) {
    pendingPhotos.splice(index, 1);
    updateLocalStorage();
    displayPendingPhotos();
}

function updateLocalStorage() {
    localStorage.setItem('photos', JSON.stringify(photos));
    localStorage.setItem('pendingPhotos', JSON.stringify(pendingPhotos));
}

document.getElementById('admin-login').addEventListener('click', function() {
    const password = prompt("Ingrese la contraseña de administrador:");
    if (password === "admin123") {  // Cambia esto por una contraseña más segura
        document.getElementById('admin-panel').style.display = 'block';
        displayPendingPhotos();
    } else {
        alert("Contraseña incorrecta");
    }
});

displayPhotos();
