const foodItems = [
    { id: 'Nasi-Lemak', name: 'Nasi Lemak', description: 'Flavorful rice cooked with coconut milk and pandan leaves, served with chili paste, boiled egg, fried anchovies and peanuts.', img: 'img/NasiLemak.jpg', category: 'malay' },
    { id: 'Murtabak', name: 'Murtabak', description: 'Pan-fried crepes, usually stuffed with beaten eggs, vegetables and minced meat.', img: 'img/Murtabak.jpg', category: 'malay' },
    { id: 'Otak-otak', name: 'Otak-Otak', description: 'Ground fish mixed with spices and wrapped in leaf parcel, served steamead or grilled.', img: 'img/Otak-otak.jpg', category: 'malay' },
    { id: 'Sate', name: 'Sate', description: 'Seasoned meat that are skewered and grilled, served with sweet and savory peanut sauce.', img: 'img/sate.jpg', category: 'malay' },
    { id: 'Chicken-rendang', name: 'Chicken Rendang', description: 'Mildly spicy chicken dish usually served with rice or roti.', img: 'img/chicken-rendang.jpg', category: 'malay' },
    { id: 'Pisang-goreng', name: 'Pisang Goreng', description: 'Delightful ripe bananas that are battered and deep fried, having distinctive flavor and texture.', img: 'img/PisangGoreng.jpg', category: 'malay' },
    { id: 'Hokkien-mee', name: 'Hokkien Mee', description: 'Thick yellow noodles stir fried with various ingredients, often in flavorful sauce', img: 'img/hokkien_mee.jpg', category: 'chinese' },
    { id: 'Wantan-mee', name: 'Wantan Mee', description: 'Consists of egg noodles served in a hot broth, garnished with leafy vegetables and wantan dumplings.', img: 'img/wantan_mee.jpg', category: 'chinese' },
    { id: 'Char-kuey-teow', name: 'Char Kuey Teow', description: 'Flat rice noodle stir-fried with mainly garlic, soy sauce and variety of ingredients.', img: 'img/char_kuey_teow.jpg', category: 'chinese' },
    { id: 'Chee-cheong-fun', name: 'Chee Cheong Fun', description: 'Steamed rice noodle rolls served plain or with various fillings and sauces.', img: 'img/chee_cheong_fun.jpg', category: 'chinese' },
    { id: 'Tanghulu', name: 'Tanghulu', description: 'Traditional chinese snack consisting of malt sugar coated fruits on a bamboo skewer.', img: 'img/tanghulu.jpg', category: 'chinese' },
    { id: 'Jianbing', name: 'Jianbing', description: 'Savory crepe or pancake that is slightly chewy and crispy with various ingredients.', img: 'img/jianbing.jpg', category: 'chinese' },
    { id: 'Roti-canai', name: 'Roti Canai', description: 'Delicious flaky flatbread eaten on its own or served with curry.', img: 'img/roti.jpg', category: 'indian' },
    { id: 'Vada-pav', name: 'Vada Pav', description: 'Savory and spicy potato dumpling with fluffy soft bun, green chili pepper and chutney', img: 'img/vada.jpg', category: 'indian' },
    { id: 'Masala-dosa', name: 'Masala Dosa', description: 'Special crispy indian style crepe with curry, chutney and sambar.', img: 'img/dosa.jpg', category: 'indian' },
    { id: 'Samosa', name: 'Samosa', description: 'Deep-fried pastry pockets filled with spiced potatoes, peas and chutney for dipping.', img: 'img/samosa.jpg', category: 'indian' },
    { id: 'Gulab-jamun', name: 'Gulab Jamun', description: 'Deep-fried balls of dough soaked in flavourful light sugary syrup.', img: 'img/gulab.jpg', category: 'indian' },
    { id: 'Banana-leaf-rice', name: 'Banana Leaf Rice', description: 'Variety of indian dishes paired with banana leaf rice.', img: 'img/banana.jpg', category: 'indian' }
];

// Append user-added items
const storedCustomItems = JSON.parse(localStorage.getItem('customFoodItems')) || [];
foodItems.push(...storedCustomItems);

let currentFilter = 'all';
const foodListEl = document.getElementById('food-list');

// --- USER & COOKIE HELPERS ---
function getLoggedInUser() {
    const user = document.cookie.split('; ').find(c => c.startsWith('loggedInUser='));
    return user ? decodeURIComponent(user.split('=')[1]) : null;
}

// --- LOCAL STORAGE HELPERS ---
function getUserData() {
    const user = getLoggedInUser();
    if (!user) return { favorites: [], ratings: {}, comments: {} };
    return JSON.parse(localStorage.getItem(`userData_${user}`)) || { favorites: [], ratings: {}, comments: {} };
}

function saveUserData(data) {
    const user = getLoggedInUser();
    if (!user) return;
    localStorage.setItem(`userData_${user}`, JSON.stringify(data));
}

// --- RENDER FUNCTIONS ---
function renderStars(id) {
    const user = getLoggedInUser();
    const data = getUserData();
    const currentRating = data.ratings[id] || 0;

    const starContainer = document.createElement('div');
    starContainer.className = 'star-rating';

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.innerHTML = i <= currentRating ? '★' : '☆';
        star.className = 'star';

        if (user) {
            star.style.cursor = 'pointer';
            star.onclick = () => {
                data.ratings[id] = i;
                saveUserData(data);
                renderFoodItems();
            };
        } else {
            star.style.cursor = 'pointer';
            star.onclick = () => alert('Please log in to rate this food!');
        }

        starContainer.appendChild(star);
    }
    return starContainer;
}

function renderComments(id) {
    const user = getLoggedInUser();
    const data = getUserData();
    const itemComments = data.comments[id] || [];

    const container = document.createElement('div');
    container.className = 'comments-container mt-2';

    if (itemComments.length) {
        const list = document.createElement('ul');
        list.className = 'comments-list';
        itemComments.forEach(c => {
            const li = document.createElement('li');
            li.textContent = c;
            list.appendChild(li);
        });
        container.appendChild(list);
    }

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = user ? 'Add a comment...' : 'Log in to comment';
    input.className = 'form-control mt-2';
    input.disabled = !user;

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add';
    addBtn.className = 'btn btn-outline-secondary btn-sm mt-1';

    if (user) {
        addBtn.onclick = () => {
            if (!input.value.trim()) return;
            if (!data.comments[id]) data.comments[id] = [];
            data.comments[id].push(input.value.trim());
            saveUserData(data);
            renderFoodItems();
        };
    } else {
        addBtn.disabled = false;
        addBtn.onclick = () => alert('Please log in to add a comment!');
    }

    container.append(input, addBtn);
    return container;
}

// In toggleFavorite function:
function toggleFavorite(id) {
    const user = getLoggedInUser();
    if (!user) {
        alert('Please log in to favorite this food!');
        return;
    }

    const data = getUserData();
    if (!data.favorites.includes(id)) data.favorites.push(id);
    else data.favorites = data.favorites.filter(f => f !== id);
    saveUserData(data);
    renderFoodItems();
}


function renderFoodItems() {
    const user = getLoggedInUser();
    const data = getUserData();

    const sorted = [...foodItems].sort((a, b) => (data.ratings[b.id] || 0) - (data.ratings[a.id] || 0));

    foodListEl.innerHTML = '';
    sorted.forEach(item => {
        const card = document.createElement('div');
        card.className = 'food-card col-md-4 mb-4';
        card.dataset.id = item.id;

        const inner = document.createElement('div');
        inner.className = 'card h-100';

        const img = document.createElement('img');
        img.src = item.img;
        img.className = 'card-img-top food-img';
        img.alt = item.name;

        const body = document.createElement('div');
        body.className = 'card-body';

        const row = document.createElement('div');
        row.className = 'd-flex justify-content-between align-items-center mb-2';
        const title = document.createElement('h5');
        title.textContent = item.name;

        const favBtn = document.createElement('button');
        favBtn.className = 'btn btn-link p-0 favorite-btn';
        favBtn.innerHTML = data.favorites.includes(item.id) ? '❤️' : '🤍';
        if (user) {
            favBtn.onclick = e => {
                e.stopPropagation();
                toggleFavorite(item.id);
            };
        } else {
            favBtn.style.cursor = 'pointer';
            favBtn.onclick = () => alert('Please log in to favorite this food!');
        }

        row.append(title, favBtn);

        const desc = document.createElement('p');
        desc.textContent = item.description;

        const ratingCont = renderStars(item.id);
        const commentsCont = renderComments(item.id);

        body.append(row, desc, ratingCont, commentsCont);
        inner.append(img, body);
        card.appendChild(inner);
        foodListEl.appendChild(card);
    });

    // Apply filter after rendering
    filterItems(currentFilter);
}

// --- FILTERS ---
function filterItems(type) {
    currentFilter = type;

    const items = document.querySelectorAll('.food-card');
    let visibleCount = 0;
    items.forEach(item => {
        const id = item.dataset.id;
        const data = getUserData();
        const category = foodItems.find(f => f.id === id)?.category;
        const isFavorite = data.favorites.includes(id);
        let show = true;

        switch (type) {
            case 'favorites': show = isFavorite; break;
            case 'malay':
            case 'chinese':
            case 'indian': show = category === type; break;
            default: show = true;
        }

        item.style.display = show ? 'block' : 'none';
        if (show) visibleCount++;
    });

    // Show empty message if needed
    let empty = document.getElementById('empty-message');
    if (!empty) {
        empty = document.createElement('div');
        empty.id = 'empty-message';
        empty.className = 'text-muted text-center';
        empty.style.padding = '40px 0';
        foodListEl.appendChild(empty);
    }
    empty.textContent = visibleCount === 0 && type === 'favorites' ? 'No favorite food items yet.' : '';
    empty.style.display = visibleCount === 0 && type === 'favorites' ? 'block' : 'none';
}

// --- INIT ---
window.addEventListener('DOMContentLoaded', () => {
    renderFoodItems();

    // FILTER BUTTONS
    const filterButtons = document.querySelectorAll('#food-filters button');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.filter;
            filterItems(type);
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
});
