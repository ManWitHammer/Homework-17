const getData = url =>
	new Promise((resolve, reject) =>
		fetch(url)
			.then(response => response.json())
			.then(json => resolve(json))
			.catch(error => reject(error))
	)

const postData = (url, title, price, ingridients, color) => {
	ingridients = ingridients.split(', ')
	return new Promise((resolve, reject) =>
		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				title,
				price,
				ingridients,
				color
			}),
			headers: { 'Content-type': 'application/json; charset=UTF-8' }
		})
			.then(response => response.json())
			.then(json => resolve(json))
			.catch(error => reject(error))
	)
}

const patchData = (url, id, title, price, ingridients, color) => {
	ingridients = ingridients.split(', ')
	console.log(id, title, price, ingridients, color)
	return new Promise((resolve, reject) =>
		fetch(url, {
			method: 'PATCH',
			body: JSON.stringify({
				id,
				title,
				price,
				ingridients,
				color
			}),
			headers: { 'Content-type': 'application/json; charset=UTF-8' }
		})
			.then(response => response.json())
			.then(json => resolve(json))
			.catch(error => reject(error))
	)
}

const list = document.querySelector('.products')
const postBtn = document.querySelector('.create-product button')
const prokrutka = document.querySelector('.post')

prokrutka.addEventListener('click', function() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    })
});

// отобразить все продукты
document.addEventListener('DOMContentLoaded', async e => {
	e.preventDefault()
	try {
		const products = await getData('http://localhost:3000/PRODUCTS')
		products.forEach(product => {
			list.insertAdjacentHTML(
				`beforeend`,
				`
			<li class="productItem">
				<div class="block-color">
					<img src="${product.color}">
				</div>
				<div class="text-info">
					<p class="title">${product.title}</p>
					<div class="price"><span>${product.ingridients
									.map(comment => `<li class="com">${comment}</li>`)
									.join('')}</span> | ⏱️${product.price} минут</div>
					</div>
				</div>
			</li>
			`
			)	
		})
	} catch (error) {
		console.log(error)
	}
})

// добавить новый продукт
postBtn.addEventListener('click', async e => {
	e.preventDefault()
	let title = document.querySelector('#title').value
	let price = +document.querySelector('#time').value
	let ingridients = document.querySelector('#ingredients').value
	let color = document.querySelector('#image').value
	try {
		await postData(
			'http://localhost:3000/PRODUCTS',
			title,
			price,
			ingridients,
			color
		).then(response => {
			console.log(response, 'данные успешно добавлены')
		})
	} catch (error) {
		console.error(error)
	}
})