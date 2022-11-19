const container = document.querySelector('main');

const popupBlock = document.querySelector('.popup-wrapper');

popupBlock.querySelector('.popup__close').addEventListener('click', function() {
    popupBlock.classList.remove('active');
})

document.querySelector('#add').addEventListener('click', function(e) {
    e.preventDefault();
    popupBlock.classList.add('active');
})

const addForm = document.forms.addForm;

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

    let like = "";
	like.onclick = () => {
		//....
		// cat.id
	}

    const del = document.createElement('button');
    del.innerText = 'delete';
    del.id = cat.id;
    del.addEventListener('click', function(e) {
        let id = e.target.id;
        deleteCat(id, card);
    })

    card.append(img, name, del);
    parent.append(card);
}

// createCard({name: 'Вася', img_link: ''}, container);

// запрос на сервер
fetch('https://sb-cats.herokuapp.com/api/2/Leontev-E/show')
    // ответ от сервера что такой запрос существует
    .then(res => res.json())
    // получение результата
    .then(result => {
        //console.log(result);
        if (result.message === 'ok') {
            console.log(result.data[0]);
            result.data.forEach(function(el) {
                createCard(el, container);
            })
        }
    })

// const cat = {
//     id: 12,
//     name: 'Василий',
//     img_link: 'https://catherineasquithgallery.com/uploads/posts/2021-03/1614547724_12-p-kotik-na-belom-fone-22.png'
// }

// JSON.stringify(obj) - сделает из объекта строку
// JSON.parse(str) - сделает из строки объект (если внутри строки объек)

const addCat = function(cat) {
    fetch('https://sb-cats.herokuapp.com/api/2/Leontev-E/add', {
        method: 'POST',
        headers: { // обязательно для POST/PUT/PATCH
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cat) // обязательно для POST/PUT/PATCH
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        if (data.message ==='ok') {
            createCard(cat, container);
            addForm.reset();
        }
    })
}

const deleteCat = function(id, tag) {
	fetch(`https://sb-cats.herokuapp.com/api/2/Leontev-E/delete/${id}`, {
		method: "DELETE"
	})
	.then(res => res.json())
	.then(data => {
		console.log(data);
		if (data.message === "ok") {
			tag.remove();
		}
	})
}


addForm.addEventListener("submit", function(e) {
	e.preventDefault();
	let body = {}; 

	for (let i = 0; i < addForm.elements.length; i++) {
		let el = addForm.elements[i];
		console.log(el);
		if (el.name) {
			body[el.name] = el.name === "favourite" ? el.checked : el.value
		}
	}

	console.log(body);
    addCat(body);
});
