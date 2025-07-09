// Получаем текущего пользователя (первый в массиве currentUser)
function getCurrentUser() {
    const currentUserArr = JSON.parse(localStorage.getItem('currentUser'));
    if (Array.isArray(currentUserArr) && currentUserArr.length > 0) {
        return currentUserArr[0];
    }
    return null;
}

// Сохраняем пользователя, обновляя users, currentUser и teammates
function saveUser(updatedUser, oldEmail) {
    let users = JSON.parse(localStorage.getItem('users')) || [];

    users = users.map(user => {
        if (user.email === oldEmail) {
            return updatedUser;
        }
        return user;
    });

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify([updatedUser]));

    // Обновляем teammates, если email изменился
    const teammatesData = JSON.parse(localStorage.getItem('teammates')) || {};
    if (oldEmail !== updatedUser.email) {
        if (teammatesData[oldEmail]) {
            teammatesData[updatedUser.email] = teammatesData[oldEmail];
            delete teammatesData[oldEmail];
        }
        localStorage.setItem('teammates', JSON.stringify(teammatesData));
    }
}

function initProfile() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('name').value = user.name || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('password').value = user.password || '';
    document.getElementById('password-confirm').value = user.password || '';
    document.getElementById('avatar-preview').src = user.avatar || 'assets/default-avatar.png';
}

function readImage(file, callback) {
    const reader = new FileReader();
    reader.onload = e => callback(e.target.result);
    reader.readAsDataURL(file);
}

document.getElementById('avatar-input').addEventListener('change', event => {
    const file = event.target.files[0];
    if (file) {
        readImage(file, dataUrl => {
            const avatarPreview = document.getElementById('avatar-preview');
            avatarPreview.src = dataUrl;
            avatarPreview.dataset.newAvatar = dataUrl;
        });
    }
});

document.getElementById('profile-form').addEventListener('submit', event => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    if (password !== passwordConfirm) {
        alert('Пароли не совпадают!');
        return;
    }

    const user = getCurrentUser();
    if (!user) {
        alert('Пользователь не найден');
        return;
    }

    const oldEmail = user.email;

    const updatedUser = {
        ...user,
        name,
        email,
        password,
        isAuth: true,
    };

    // Если загружен новый аватар — сохраняем
    const newAvatar = document.getElementById('avatar-preview').dataset.newAvatar;
    if (newAvatar) {
        updatedUser.avatar = newAvatar;
    }

    saveUser(updatedUser, oldEmail);

    alert('Профиль успешно обновлен!');
    // Можно обновить страницу или перенаправить, например:
    // window.location.reload();
});

document.getElementById('logout-btn').addEventListener('click', () => {
    window.location.href = 'home.html';
});

function togglePasswordVisibility(inputId, toggleBtnId) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(toggleBtnId);

    btn.addEventListener('click', () => {
        if (input.type === 'password') {
            input.type = 'text';
            btn.textContent = '👁️';
        } else {
            input.type = 'password';
            btn.textContent = '🙈';
        }
    });
}

togglePasswordVisibility('password', 'toggle-password');
togglePasswordVisibility('password-confirm', 'toggle-password-confirm');

window.addEventListener('DOMContentLoaded', initProfile);
