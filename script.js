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
						<img src="https://eda.ru/images/RecipePhoto/190x190/brauni-brownie_20955_photo_29166.webp">
					</div>
					<div class="text-info">
						<div class="title">
							<p>Брауни</p>
							<p class="timer">30 минут</p>
						</div>
						<div class="price">
							<div class="likeOrDislike">
								<span class="post-rating-button material-icons liked1">thumb_up</span>
								<span class="post-rating-button material-icons disliked1">thumb_down</span>
							</div>
							<div class="price-info">
								<span class="post-rating-button material-icons menu">reorder</span>
							</div>
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