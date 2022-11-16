const container = document.querySelector('main');

const createCard = function(cat, parent) {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('div');
    img.className = 'card-pic';
    if (cat.img_link) {
    img.style.backgroundImage = `url(${cat.img_link})`;
    } else {
    img.style.backgroundImage = 'url(img/cat.png)';
    img.style.backgroundSize = 'contain';
    img.style.backgroundColor = 'transparent';
    }

    const name = document.createElement('h3');
    name.innerText = cat.name;

    card.append(img, name);
    parent.append(card);
}

// createCard({name: 'Вася', img_link: ''}, container);

fetch('https://sb-cats.herokuapp.com/api/2/Leontev-E/show')
    .then(res => res.json())
    .then(result => {
        //console.log(result);
        if (result.message === 'ok') {
            console.log(result.data[0]);
            result.data.forEach(function(el) {
                createCard(el, container);
            })
        }
    })

const cat = {
    id: 12,
    name: 'Василий',
    img_link: 'https://catherineasquithgallery.com/uploads/posts/2021-03/1614547724_12-p-kotik-na-belom-fone-22.png'
}

// JSON.stringify(obj) - сделает из объекта строку
// JSON.parse(str) - сделает из строки объект (если внутри строки объек)

const addCat = function() {
    fetch('https://sb-cats.herokuapp.com/api/2/Leontev-E/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cat)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        if (data.message ==='ok') {
            createCard(cat, container)
        }
    })
}

document.querySelector('#add').addEventListener('click', function(e) {
    e.preventDefault();
    addCat();
})