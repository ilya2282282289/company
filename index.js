function setActive(mode) {
    const signUpBtn = document.querySelector('.signup');
    const loginBtn = document.querySelector('.login');
    const fieldName = document.getElementById('field-name');
    const fieldRepeat = document.getElementById('field-repeat');
    const submitText = document.getElementById('submit-text').querySelector('p');
    const errorEl = document.getElementById('error');
    const inputName = document.getElementById('name');
    const inputRepeat = document.getElementById('repeat_password');

    if (mode === 'signup') {
        signUpBtn.classList.add('active');
        loginBtn.classList.remove('active');
        fieldName.style.display = 'flex';
        fieldRepeat.style.display = 'flex';
        submitText.innerText = 'Register';
        inputName.required = true;
        inputRepeat.required = true;
    } else {
        loginBtn.classList.add('active');
        signUpBtn.classList.remove('active');
        fieldName.style.display = 'none';
        fieldRepeat.style.display = 'none';
        submitText.innerText = 'Log in';
        inputName.required = false;
        inputRepeat.required = false;
    }

    errorEl.style.display = 'none';
}

window.addEventListener('DOMContentLoaded', () => {
    setActive('signup');

    document.querySelector('.signup').addEventListener('click', () => setActive('signup'));
    document.querySelector('.login').addEventListener('click', () => setActive('login'));

    document.getElementById('form-register').addEventListener('submit', function (e) {
        e.preventDefault();

        const isRegister = document.querySelector('.signup').classList.contains('active');
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const repeatPassword = document.getElementById('repeat_password').value;
        const errorEl = document.getElementById('error');

        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (isRegister) {
            if (!name || !email || !password || !repeatPassword) {
                errorEl.textContent = 'Please fill in all fields.';
                errorEl.style.display = 'block';
                return;
            }

            if (password !== repeatPassword) {
                errorEl.textContent = 'Passwords do not match.';
                errorEl.style.display = 'block';
                return;
            }

            if (users.some(u => u.email === email)) {
                errorEl.textContent = 'This email is already registered.';
                errorEl.style.display = 'block';
                return;
            }

            // Добавляем нового пользователя
            const newUser = { name, email, password, isAuth: true, avatar: 'assets/default-avatar.png' };

            // Отмечаем всех остальных как неавторизованных
            users = users.map(u => ({ ...u, isAuth: false }));

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify([newUser]));

            window.location.href = 'home.html';
        } else {
            // Вход
            const userIndex = users.findIndex(u => u.email === email);

            if (userIndex === -1 || users[userIndex].password !== password) {
                errorEl.textContent = 'Invalid email or password.';
                errorEl.style.display = 'block';
                return;
            }

            // Устанавливаем isAuth = true только для вошедшего пользователя
            users = users.map(u => ({
                ...u,
                isAuth: u.email === email
            }));

            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify([users[userIndex]]));

            window.location.href = 'home.html';
        }
    });
});
