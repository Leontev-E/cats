const container = document.querySelector("main");
const popupBlock = document.querySelector(".popup-wrapper");
const popupAdd = popupBlock.querySelector(".popup-add");
const popupUpd = popupBlock.querySelector(".popup-upd");
const addForm = document.forms.addForm;
const updForm = document.forms.updForm;
const cards = document.getElementsByClassName("card");
let cats;
const infoBlock = document.querySelector(".info-block");

document.getElementById("user").addEventListener("click", function() {
	localStorage.removeItem("catUser");
    localStorage.removeItem("catArr");
});

popupBlock.querySelectorAll(".popup__close").forEach(function(btn) {
	btn.addEventListener("click", function() {
		popupBlock.classList.remove("active");
		btn.parentElement.classList.remove("active");
		if (btn.parentElement.classList.contains("popup-upd")) {
			updForm.dataset.id = "";
		}
	});
});

document.querySelector("#add").addEventListener("click", function(e) {
	e.preventDefault();
	popupBlock.classList.add("active");
	popupAdd.classList.add("active");
});

const showForm = function(data) {
	for (let i = 0; i < updForm.elements.length; i++) {
		let el = updForm.elements[i];
		if (el.name) {
			if (el.type !== "checkbox") {
				el.value = data[el.name] ? data[el.name] : "";
			} else {
				el.checked = data[el.name];
			}
		}
	}
}

const deleteCat = async function(id, tag) {
	let res = await fetch(`https://sb-cats.herokuapp.com/api/2/${user}/delete/${id}`, {
		method: "DELETE"
	});
	let data = await res.json();
	if (data.message === "ok") {
		tag.remove();
        cats = cats.filter(el => +el.id !== +id);
        localStorage.setItem("catArr", JSON.stringify(cats));
	}
}

const createCard = function(cat, parent) {
	const card = document.createElement("div");
	card.className = "card";
	card.dataset.id = cat.id;

	const img = document.createElement("div");
	img.className = "card-pic";
	if (cat.img_link) {
		img.style.backgroundImage = `url(${cat.img_link})`;
	} else {
		img.style.backgroundImage = "url(img/cat.png)";
		img.style.backgroundSize = "contain";
		img.style.backgroundColor = "transparent";
	}

	const name = document.createElement("h3");
	name.innerText = cat.name;

	const del = document.createElement("button");
	del.innerText = "удалить";
	del.id = cat.id;
	del.addEventListener("click", function(e) {
		let id = e.target.id;
		deleteCat(id, card);
	});

	const upd = document.createElement("button");
	upd.innerText = "изменить";
	upd.addEventListener("click", function(e) {
		popupUpd.classList.add("active");
		popupBlock.classList.add("active");
		showForm(cat);
		updForm.setAttribute("data-id", cat.id);
	})

	card.append(img, name, del, upd);
	parent.append(card);
}

const setCards = function(arr) {
    container.innerHTML = "";
    arr.forEach(function(el) {
        createCard(el, container);
    })
}

const addCat = function(cat) {
	fetch(`https://sb-cats.herokuapp.com/api/2/${user}/add`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(cat)
	})
		.then(res => res.json())
		.then(data => {
			if (data.message === "ok") {
				createInfo(cat, container);
				createCard(cat, container);
                cats.push(cat);
                localStorage.setItem("catArr", JSON.stringify(cats))
				addForm.reset();
				popupBlock.classList.remove("active");
			}
		})
}

const updCat = async function(obj, id) {
	let res = await fetch(`https://sb-cats.herokuapp.com/api/2/${user}/update/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(obj)
	})
	let answer = await res.json();
	if (answer.message === "ok") {
        cats = cats.map(el => {
            if (+el.id === +id) {
                return {...el, ...obj};
            } else {
                return el;
            }
        });
        localStorage.setItem("catArr", JSON.stringify(cats));
        setCards(cats);
		updForm.reset();
		updForm.dataset.id = "";
		popupUpd.classList.remove("active");
		popupBlock.classList.remove("active");
	}
}

let user = localStorage.getItem("catUser");
if (!user) {
    user = prompt("Представьтесь, пожалуйста")
	localStorage.setItem("catUser", user);
}

cats = localStorage.getItem("catArr"); // "[{},{}]"
if (cats) {
    cats = JSON.parse(cats); // [{}, {}]
    setCards(cats);
} else {
    fetch(`https://sb-cats.herokuapp.com/api/2/${user}/show`)
	.then(res => res.json())
	.then(result => {
		if (result.message === "ok") {
            cats = result.data;
            localStorage.setItem("catArr", JSON.stringify(cats));
			setCards(cats);
		}
	});
}

addForm.addEventListener("submit", function(e) {
	e.preventDefault();
	let body = {}; 
	for (let i = 0; i < addForm.elements.length; i++) {
		let el = addForm.elements[i];
		if (el.name) {
			body[el.name] = el.name === "favourite" ? el.checked : el.value;
		}
	}
	addCat(body);
});

updForm.addEventListener("submit", function(e) {
	e.preventDefault();
	let body = {}; 
	for (let i = 0; i < this.elements.length; i++) {
		let el = this.elements[i];
		if (el.name) {
			body[el.name] = el.name === "favourite" ? el.checked : el.value;
		}
	}
	delete body.id;
	updCat(body, updForm.dataset.id);
});




// const createInfo = function(cat, parent) {
// 	const bac = document.createElement("div");
// 	bac.className = "info-block";

// 	const img = document.createElement("div");
// 	img.className = "card-pic";
// 	if (cat.img_link) {
// 		img.style.backgroundImage = `url(${cat.img_link})`;
// 	} else {
// 		img.style.backgroundImage = "url(img/cat.png)";
// 		img.style.backgroundSize = "contain";
// 		img.style.backgroundColor = "transparent";
// 	}

// 	const name = document.createElement("h3");
// 	name.innerText = cat.name;


// 	bac.append(img, name, del, upd);
// 	parent.append(bac);
// }
// const seCards = function(arr) {
//     container.innerHTML = "";
//     arr.forEach(function(el) {
//         createInfo(el, container);
//     })
// }

const getWord = function (n, w1, w2, w0) {
    if (n % 100 < 11 || n % 100 > 14) {
        if (n % 10 === 1) {
            return w1;
        } else if (n % 10 >= 2 && n % 10 <= 4) {
            return w2;
        } else {
            return w0;
        }
    } else {
        return w0;
    }
}

const showInfo = function (data) {
    infoBlock.classList.add("active");
    infoBlock.firstElementChild.innerHTML = `
        <img class="info-img" src="${data.img_link}" alt="${data.name}">
        <div class="information">
            <h2>${data.name}</h2>
            <h3>${data.age} ${getWord(data.age, "год", "года", "лет")}</h3>
            <p>${data.description}</p>
			<h3>рейтинг котика: ${data.rate}/10 &#9734;</h3>

        </div>
        <div class="info-close" onclick="closeInfo()"></div>
    `;
}

const closeInfo = function () {
    infoBlock.classList.remove("active");
}

let back = document.querySelectorAll('.card-pic')
for (let i = 0; i < back.length; i++) {
	back[i].addEventListener("click", function(e) {
		showInfo(cats[i]);
	})
}