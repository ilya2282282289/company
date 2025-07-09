const btnAddTeammate = document.getElementById("btn-add-teammate");
const modal = document.getElementById("modal-add-teammate");
const btnCloseModal = document.getElementById("btn-close-modal");
const formAddTeammateEl = document.querySelector("#form-add-teammate");
const teamCardsEl = document.querySelector(".metrics-card");
const favoritsText = document.querySelector(".favorit");
const btnLogout = document.querySelector(".log-out");
const profileBtn = document.getElementById('profile-btn');
const profileAvatarImg = document.getElementById('profile-avatar');
const filtersPanel = document.querySelector(".filters-panel");
const viewButtons = document.querySelectorAll('.view-btn');
const cardContainer = document.getElementById('card-container');

let editIndex = null;
let currentViewClass = "grid-three"; // по умолчанию вид карточек
let currentFilters = {
  position: "all",
  isFavorit: null, // null = все, true = только избранные
};

// Данные по умолчанию
const defaultTeammets = [
    {
        avatar: "https://untitledui.com/images/avatars/transparent/amelie-laurent",
        backetball_url: "",
        description: "Former co-founder of Opendoor. Early staff at Spotify and Clearbit.",
        in_url: "",
        name: "Amélie Laurent",
        position: "Founder & CEO",
        x_url: "",
        isFavorit: false,
    },
    {
        avatar: "https://untitledui.com/images/avatars/transparent/phoenix-baker",
        backetball_url: "",
        description: "Former PM for Linear, Lambda School, and On Deck.",
        in_url: "",
        name: "Nikolas Gibbons",
        position: "Product Manager",
        x_url: "",
        isFavorit: false,
    },
    {
        avatar: "https://untitledui.com/images/avatars/transparent/candice-wu",
        backetball_url: "",
        description: "Former co-founder of Opendoor. Early staff at Spotify and Clearbit.",
        in_url: "",
        name: "Sienna Hewitt",
        position: "Founder & CEO",
        x_url: "",
        isFavorit: false,
    },
    {
        avatar: "https://untitledui.com/images/avatars/transparent/demi-wilkinson",
        backetball_url: "",
        description: "Former frontend dev for Linear, Coinbase, and Postscript.",
        in_url: "",
        name: "Lily-Rose Chedjou",
        position: "Frontend Developer",
        x_url: "",
        isFavorit: false,
    },
    {
        avatar: "https://untitledui.com/images/avatars/transparent/kate-morrison",
        backetball_url: "",
        description: "Lead backend dev at Clearbit. Former Clearbit and Loom.",
        in_url: "",
        name: "Zahra Christensen",
        position: "Backend Developer",
        x_url: "",
        isFavorit: false,
    },
    {
        avatar: "https://untitledui.com/images/avatars/transparent/ava-wright",
        backetball_url: "",
        description: "Founding design team at Figma. Former Pleo, Stripe, and Tile.",
        in_url: "",
        name: "Caitlyn King",
        position: "Product Designer",
        x_url: "",
        isFavorit: false,
    },
    {
        avatar: "https://untitledui.com/images/avatars/transparent/drew-cano",
        backetball_url: "",
        description: "Lead user research for Slack. Contractor for Netflix and Udacity.",
        in_url: "",
        name: "Zaid Schwartz",
        position: "UX Researcher",
        x_url: "",
        isFavorit: false,
    },
    {
        avatar: "https://untitledui.com/images/avatars/transparent/zahir-mays",
        backetball_url: "",
        description: "Lead CX at Wealthsimple. Former PagerDuty and Sqreen.",
        in_url: "",
        name: "Marco Kelly",
        position: "Customer Success",
        x_url: "",
        isFavorit: false,
    }

];

// === Работа с локальным хранилищем и пользователем ===

function getCurrentUser() {
  const currentUsers = JSON.parse(localStorage.getItem('currentUser')) || [];
  return currentUsers.length ? currentUsers[0] : null;
}

function loadAllTeammatesData() {
  const raw = localStorage.getItem("teammates");
  return raw ? JSON.parse(raw) : {};
}

function saveAllTeammatesData(data) {
  localStorage.setItem("teammates", JSON.stringify(data));
}

function initUserCardsIfNeeded() {
  const user = getCurrentUser();
  if (!user) return;

  const allData = loadAllTeammatesData();

  if (!allData[user.email] || allData[user.email].length === 0) {
    allData[user.email] = JSON.parse(JSON.stringify(defaultTeammets));
    saveAllTeammatesData(allData);
  }
}

function loadCard() {
  const user = getCurrentUser();
  if (!user) return [];

  const allData = loadAllTeammatesData();
  return allData[user.email] || [];
}

function saveCard(teammates) {
  const user = getCurrentUser();
  if (!user) return;

  const allData = loadAllTeammatesData();
  allData[user.email] = teammates;
  saveAllTeammatesData(allData);
}

// === Обновление аватарки профиля ===

function updateProfileAvatar() {
  const user = getCurrentUser();
  if (user) {
    profileAvatarImg.src = user.avatar || 'assets/default-avatar.png';
  }
}

// === Создание карточки ===

function createCard(teammate, index) {
  const { avatar, name, position, description, x_url, in_url, backetball_url, isFavorit } = teammate;
  const card = document.createElement("div");
  card.className = "card-profile";

  let linksHTML = '';
  if (x_url) linksHTML += `<a href="${x_url}" target="_blank"><img src="assets/x.png" alt="X" width="20px"></a>`;
  if (in_url) linksHTML += `<a href="${in_url}" target="_blank"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUsK0tDPaYbYzeYuDeqFzhqdD2YPeQWOTAg70AJuo_T5kvcj6oGH-qnOJcRP3o3y-V5dg&usqp=CAU" alt="LinkedIn" width="20px"></a>`;
  if (backetball_url) linksHTML += `<a href="${backetball_url}" target="_blank"><img src="assets/basketball.png" alt="Dribbble" width="20px"></a>`;

  const starIcon = isFavorit
    ? "assets/star.png"
    : "https://foni.papik.pro/uploads/posts/2024-10/foni-papik-pro-r0hf-p-kartinki-cherno-belie-zvezdi-na-prozrachno-4.png";

  card.innerHTML = `
      <button class="favorit-btn" data-index="${index}">
          <img src="${starIcon}" class="img-favorit" width="20px" height="20px">
      </button>
      <img src="https://cdn-icons-png.flaticon.com/512/1483/1483063.png" class="btn-delete" data-index="${index}" width="20px" height="20px">
      <div class="avatar-wrapper">
          <img class="profile" src="${avatar}" alt="${name}">
      </div>
      <h3>${name}</h3>
      <a href="#" class="role">${position}</a>
      <p class="description">${description}</p>
      <div class="icons">${linksHTML}</div>
      <button class="btn-edit" data-index="${index}">Редактировать</button><br>
  `;

  card.querySelector(".btn-delete").addEventListener("click", () => {
    const teammates = loadCard();
    teammates.splice(index, 1);
    saveCard(teammates);
    renderCards();
  });

  card.querySelector(".btn-edit").addEventListener("click", () => {
    const teammates = loadCard();
    const t = teammates[index];
    for (const key in t) {
      if (formAddTeammateEl.elements[key]) {
        formAddTeammateEl.elements[key].value = t[key];
      }
    }
    editIndex = index;
    modal.style.display = "flex";
  });

  card.querySelector(".favorit-btn").addEventListener("click", () => {
    const teammates = loadCard();
    teammates[index].isFavorit = !teammates[index].isFavorit;
    saveCard(teammates);
    renderCards();
  });

  return card;
}

// Обновим renderCards для работы с множественным выбором позиций

function renderCards() {
  const teammates = loadCard();

  // Применяем фильтры
  const filtered = teammates.filter(t => {
    // Фильтр по позициям
    let matchPosition;
    if (currentFilters.position === "all") {
      matchPosition = true;
    } else if (selectedPositions.size > 0) {
      matchPosition = selectedPositions.has(t.position);
    } else {
      matchPosition = true; // если не выбрано ничего — показываем все
    }

    // Фильтр по избранным
    let matchFavorit = (currentFilters.isFavorit === null) || (t.isFavorit === currentFilters.isFavorit);

    return matchPosition && matchFavorit;
  });

  teamCardsEl.innerHTML = "";

  const favorits = filtered.filter(t => t.isFavorit).length;
  favoritsText.innerText = `Favorits: ${favorits}`;

  filtered.forEach((teammate, index) => {
    const card = createCard(teammate, index);
    teamCardsEl.appendChild(card);
  });
}

// === Обработка формы добавления/редактирования ===

formAddTeammateEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(formAddTeammateEl);
  const teammate = Object.fromEntries(formData.entries());
  teammate.isFavorit = teammate.isFavorit ?? false;

  const teammates = loadCard();

  if (editIndex !== null) {
    teammates[editIndex] = { ...teammates[editIndex], ...teammate };
    editIndex = null;
  } else {
    teammates.push(teammate);
  }

  saveCard(teammates);
  renderCards();
  modal.style.display = "none";
  formAddTeammateEl.reset();
});

// === Логика фильтров ===

// Создаем UI фильтров в filtersPanel (позиции и избранные)

// Переменная для выбранных позиций (множественный выбор)
let selectedPositions = new Set();

function createFiltersUI() {
  filtersPanel.innerHTML = "";

  // Заголовок
  const title = document.createElement("h3");
  title.textContent = "Фильтры";
  title.style.marginBottom = "16px";
  filtersPanel.appendChild(title);

  // Получаем уникальные позиции из данных
  const positions = [...new Set(loadCard().map(t => t.position))].filter(Boolean);

  // Блок для чекбоксов
  const positionLabel = document.createElement("div");
  positionLabel.textContent = "Позиция:";
  positionLabel.style.marginBottom = "8px";
  filtersPanel.appendChild(positionLabel);

  const positionContainer = document.createElement("div");
  positionContainer.style.display = "flex";
  positionContainer.style.flexWrap = "wrap";
  positionContainer.style.gap = "10px";
  filtersPanel.appendChild(positionContainer);

  // Создаем чекбоксы для каждой позиции
  positions.forEach(pos => {
    const label = document.createElement("label");
    label.style.userSelect = "none";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = pos;
    checkbox.name = "position-filter";

    // По умолчанию выбираем все (можно изменить)
    checkbox.checked = (currentFilters.position === "" || currentFilters.position === pos);

    if (checkbox.checked) {
      selectedPositions.add(pos);
    }

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        selectedPositions.add(pos);
      } else {
        selectedPositions.delete(pos);
      }
      // Если ни одной позиции не выбрано, считаем, что выбраны все
      if (selectedPositions.size === 0) {
        currentFilters.position = "all";
      } else {
        currentFilters.position = null; // чтобы показать, что фильтр по множеству позиций
      }
      renderCards();
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(pos));
    positionContainer.appendChild(label);
  });

  // Фильтр избранных (селект)
  const favoritLabel = document.createElement("label");
  favoritLabel.textContent = "Избранные:";
  favoritLabel.style.display = "block";
  favoritLabel.style.margin = "16px 0 8px";
  filtersPanel.appendChild(favoritLabel);

  const favoritSelect = document.createElement("select");
  favoritSelect.style.width = "100%";
  favoritSelect.style.padding = "8px";
  favoritSelect.style.borderRadius = "6px";
  favoritSelect.style.border = "1px solid #ccc";

  [
    { val: null, text: "Все" },
    { val: true, text: "Только избранные" },
  ].forEach(opt => {
    const option = document.createElement("option");
    option.value = opt.val === null ? "all" : "fav";
    option.textContent = opt.text;
    favoritSelect.appendChild(option);
  });

  favoritSelect.value = currentFilters.isFavorit === true ? "fav" : "all";
  filtersPanel.appendChild(favoritSelect);

  favoritSelect.addEventListener("change", () => {
    currentFilters.isFavorit = favoritSelect.value === "fav" ? true : null;
    renderCards();
  });
}

// === Переключение вида карточек ===

function setCardView(viewClass) {
  const cardsContainer = document.querySelector('.metrics-card');
  cardsContainer.className = 'metrics-card'; // сброс всех классов
  cardsContainer.classList.add(viewClass);
  currentViewClass = viewClass;

  // Показывать или скрывать панель фильтров в зависимости от вида
  if (viewClass === "grid-three") {
    filtersPanel.style.display = "block";
  } else {
    filtersPanel.style.display = "none";
  }
}

// === Слушатели кнопок вида ===

document.getElementById("view-large-grid").addEventListener("click", () => {
  setCardView("grid-three");
  renderCards();
});

document.getElementById("view-small-grid").addEventListener("click", () => {
  setCardView("grid-four");
  renderCards();
});

document.getElementById("view-list").addEventListener("click", () => {
  setCardView("list-view");
  renderCards();
});

document.getElementById("view-row").addEventListener("click", () => {
  setCardView("row-view");
  renderCards();
});

// === Загрузка фактов (твоя часть) ===

const API_URL = "https://meowfacts.herokuapp.com/?lang=rus";
const textCats = document.querySelector(".random-cats");

fetch(API_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    textCats.classList.remove("loading");
    textCats.textContent = data.data[0];
    textCats.classList.add("fade-in");
  })
  .catch((error) => {
    console.error("Fetch error:", error);
    textCats.classList.remove("loading");
    textCats.textContent = "Не удалось загрузить факт 🐾";
    textCats.classList.add("fade-in");
  });

// === Слушатели инициализации ===

btnAddTeammate.addEventListener("click", () => {
  editIndex = null;
  modal.style.display = "flex";
  formAddTeammateEl.reset();
});

btnCloseModal.addEventListener("click", () => {
  modal.style.display = "none";
  formAddTeammateEl.reset();
  editIndex = null;
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    formAddTeammateEl.reset();
    editIndex = null;
  }
});

btnLogout.addEventListener("click", () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.map(user => {
    if (user.email === currentUser.email) {
      return { ...user, isAuth: false };
    }
    return user;
  });

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.removeItem("currentUser");
  window.location.href = 'index.html';
});

profileBtn.addEventListener('click', () => {
  window.location.href = 'profile.html';
});

function getCurrentUser() {
  const currentUserArr = JSON.parse(localStorage.getItem('currentUser'));
  if (Array.isArray(currentUserArr) && currentUserArr.length > 0) {
      return currentUserArr[0];
  }
  return null;
}


// === Инициализация страницы ===

// Твой полный код JavaScript с реализацией чата и карточек пользователей
// Обновленный блок чата, чтобы он работал между окнами браузера

window.addEventListener("DOMContentLoaded", () => {
  const chatToggle = document.getElementById('chat-toggle');
  const chatBox = document.getElementById('chat-box');
  const chatClose = document.getElementById('chat-close');
  const chatSend = document.getElementById('chat-send');
  const chatText = document.getElementById('chat-text');
  const chatMessages = document.getElementById('chat-messages');

  // Изначально кнопка скрыта и сдвинута вниз для анимации
  chatToggle.style.opacity = "0";
  chatToggle.style.transform = "translateY(20px)";
  chatToggle.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  chatToggle.style.display = "block"; // чтобы была в DOM и доступна

  // Появление кнопки через 5 секунд с анимацией
  setTimeout(() => {
    chatToggle.style.opacity = "1";
    chatToggle.style.transform = "translateY(0)";
  }, 5000);

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function appendMessage(sender, text, timestamp = Date.now(), avatarUrl = 'assets/default-avatar.png') {
    const msgEl = document.createElement('div');
    msgEl.className = `message ${sender}`;

    const avatarImg = document.createElement('img');
    avatarImg.className = 'avatar';
    avatarImg.src = avatarUrl;

    const textContainer = document.createElement('div');
    textContainer.innerHTML = `
      ${text}
      <div class="message-time">${new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    `;

    msgEl.appendChild(avatarImg);
    msgEl.appendChild(textContainer);

    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function sendMessage() {
    const text = chatText.value.trim();
    if (!text) return;

    const user = getCurrentUser();
    const messageObj = {
      sender: user.email,
      avatar: user.avatar || 'assets/default-avatar.png',
      text: text,
      time: Date.now(),
    };

    const allMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    allMessages.push(messageObj);
    localStorage.setItem("chatMessages", JSON.stringify(allMessages));

    appendMessage("user", text, messageObj.time, messageObj.avatar);
    chatText.value = '';
  }

  function loadMessages() {
    const user = getCurrentUser();
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    chatMessages.innerHTML = '';
    messages.forEach(msg => {
      appendMessage(msg.sender === user.email ? 'user' : 'other', msg.text, msg.time, msg.avatar);
    });
  }

  window.addEventListener('storage', (event) => {
    if (event.key === 'chatMessages') {
      loadMessages();
    }
  });

  if (chatToggle && chatBox && chatClose && chatSend && chatText && chatMessages) {
    chatToggle.addEventListener('click', () => {
      if (!chatBox.classList.contains('visible')) {
        chatBox.classList.remove('hidden');
        chatBox.classList.remove('hidden-anim');
        chatBox.classList.add('visible');
      } else {
        chatBox.classList.remove('visible');
        chatBox.classList.add('hidden-anim');
        // Через 300ms скрываем чат полностью, чтобы не мешал
        setTimeout(() => {
          chatBox.classList.add('hidden');
          chatBox.classList.remove('hidden-anim');
        }, 300);
      }
    });
    
    chatClose.addEventListener('click', () => {
      chatBox.classList.remove('visible');
      chatBox.classList.add('hidden-anim');
      setTimeout(() => {
        chatBox.classList.add('hidden');
        chatBox.classList.remove('hidden-anim');
      }, 300);
    });

    chatSend.addEventListener('click', sendMessage);
    chatText.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  loadMessages();
  initUserCardsIfNeeded();
  createFiltersUI();
  setCardView(currentViewClass);
  renderCards();
  updateProfileAvatar();
});
