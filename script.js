const getData = url =>
	new Promise((resolve, reject) =>
		fetch(url)
			.then(response => response.json())
			.then(json => resolve(json))
			.catch(error => reject(error))
	)

	const postData = (url, product) => {
		return new Promise((resolve, reject) =>
			fetch(url, {
				method: 'POST',
				body: JSON.stringify(product),
				headers: { 'Content-type': 'application/json; charset=UTF-8' }
			})
				.then(response => response.json())
				.then(json => resolve(json))
				.catch(error => reject(error))
		)
	}
	

	const delData = url => {
		return new Promise((resolve, reject) =>
			fetch(url, { method: 'DELETE' })
				.then(response => response.json())
				.then(json => resolve(json))
				.catch(error => reject(error))
		)
	}

  const patchData = (url, product) => {
	return new Promise((resolve, reject) =>
		fetch(url, {
			method: 'PATCH',
			body: JSON.stringify(product),
			headers: { 'Content-type': 'application/json; charset=UTF-8' }
		})
			.then(response => response.json())
			.then(json => resolve(json))
			.catch(error => reject(error))
	)
}

const container = document.querySelector('.container')
const h1 = document.querySelector('h1')
const postBtn = document.querySelector('.create-product button')
const prokrutka = document.querySelector('.post')
const seeIt = document.querySelector('.seeIt')
const addIt = document.querySelector('.addIt')
// отобразить все продукты

document.addEventListener('DOMContentLoaded', async e => {
	e.preventDefault()
	try {
		const products = await getData('http://localhost:3000/PRODUCTS')
		h1.innerText = 'Все рецепты'
		container.innerHTML = ''
		container.classList.remove('reverseContainer')
		products.forEach(product => {
			container.insertAdjacentHTML(
				`beforeend`,
				`
				<li class="productItem">
					<div class="block-color">
						<div class="img" style="background-image: url(${product.color});">
							<div class="post-rating-button material-icons menu">
								<div class="full-title">
									<div class="post-rating-button material-icons deleted">delete Удалить рецепт</div>
									<div class="post-rating-button material-icons commented">comment Посмотреть сообщение</div>
									<div class="post-rating-button material-icons commented">search Посмотреть рецепты</div>
								</div>
								reorder
							</div>
						</div>
					</div>
					<div class="text-info">
						<div class="title">
							<div class="title1">${
								product.title.length > 12
									? `${product.title.substring(0, 12)}...`
									: product.title
								}
								<div class ="full-title">${product.title}</div>
							</div>
							<p class="timer">${product.price} минут</p>
						</div>
						<div class="price">
							<div class="likeOrDislike">
								<div class="post-rating-button material-icons liked1" style="color: ${product.likes[1] == true
																										? 'red'
																										: 'white'};">
									thumb_up
									<div class="full-title">${product.likes[0]}</div>
								</div>
								<div class="post-rating-button material-icons disliked1" style="color: ${product.dislikes[1] == true
																										? 'red'
																										: 'white'};">
									thumb_down
									<div class="full-title">${product.dislikes[0]}</div>
								</div>
							</div>
						</div>
					</div>
				</li>
				`
			)	
		})
		const likeButtons = document.querySelectorAll('.liked1')
		likeButtons.forEach(likeButton => {
			likeButton.addEventListener('click', async e => {
				e.preventDefault()
				try {
					const titleElement = likeButton.querySelector('.full-title');
					const titleElement1 = likeButton.parentElement.querySelector('.disliked1 .full-title');
					const id = likeButton.parentElement.parentElement.parentElement.querySelector('.title')
										.querySelector('.title1').querySelector('.full-title').innerText
					let newProd = products.filter(el => el.id == id)
					newProd = newProd[0].likes[1]
					let newProd1 = products.filter(el => el.id == id)
					newProd1 = newProd1[0].dislikes[1]

					if (newProd) {
						titleElement.innerText--
						newProd = false
						titleElement1.innerText++
						newProd1 = true
				
					}
					else if (newProd1 == true && newProd == true) {
						titleElement.innerText--
						newProd = false
						titleElement1.innerText--
						newProd1 = false
					}
					else {
						titleElement.innerText++
						newProd = true
						titleElement1.innerText--
						newProd1 = false
					}
					let allLikes = +titleElement.innerText
					let likes1 = [allLikes, newProd]
					console.log(likes1)
				
					await patchData(`http://localhost:3000/PRODUCTS/${id}`, {likes: likes1}).then(response => {
						console.log(response, 'данные успешно обновлены')
					})
				} catch (error) {
					console.error(error, 'не получилось обновить данные')
				}
			
			})
		})
		const dislikeButtons = document.querySelectorAll('.disliked1')
		dislikeButtons.forEach(likeButton => {
			likeButton.addEventListener('click', async e => {
				e.preventDefault()
				try {
					const titleElement = likeButton.querySelector('.full-title');
					const titleElement1 = likeButton.parentElement.querySelector('.liked1 .full-title');
					console.log(titleElement1)
					const id = likeButton.parentElement.parentElement.parentElement.querySelector('.title')
										.querySelector('.title1').querySelector('.full-title').innerText
					let newProd = products.filter(el => el.id == id)
					newProd = newProd[0].dislikes[1]
					let newProd1 = products.filter(el => el.id == id)
					newProd1 = newProd1[0].likes[1]
					console.log(newProd)	
					if (newProd) {
						titleElement.innerText--
						newProd = false
						titleElement1.innerText++
						newProd1 = true
						
					} 
					else if (newProd1 == true && newProd == true) {
						titleElement.innerText--
						newProd = false
						titleElement1.innerText--
						newProd1 = false
					} 
					else {
						titleElement.innerText++;
						newProd = true  
						titleElement1.innerText--
						newProd1 = false
					}
					let allLikes = +titleElement.innerText;
					let likes1 = [allLikes, newProd]
					console.log(likes1)
						await patchData(`http://localhost:3000/PRODUCTS/${id}`, {dislikes: likes1}).then(response => {
							console.log(response, 'данные успешно обновлены')
						})
				} catch (error) {
					console.error(error, 'не получилось обновить данные')
				}
			
			})
		})
		const deleteButtons = document.querySelectorAll('.deleted')
		deleteButtons.forEach(deleteButton => {
			deleteButton.addEventListener('click', async e => {
				e.preventDefault()
				const id = deleteButton.parentElement.parentElement.parentElement.parentElement.parentElement
				.querySelector('.text-info .title .title1 .full-title').innerText
				try {
					delData(`http://localhost:3000/PRODUCTS/${id}`).then(response => {
						console.log(response, `продукт с id = ${id} успешно удалён`)
					})
				} catch (err) {
					console.error(err, 'ошибка при удалении')
				}
			})
		})
	} catch (error) {
		body.innerHTML = `<h1>${error}</h1>`
	}
})

addIt.addEventListener('click', () => {
	h1.innerText = 'Добавить новый рецепт'
	container.innerHTML = ''
	container.insertAdjacentHTML(
		`beforeend`,
		`
		<div class="productItem">
			<div class="block-color">
				<div class="img">
					<span class="post-rating-button material-icons menu">reorder</span>
				</div>
			</div>
			<div class="text-info">
				<div class="title">
					<div class="title1">
						<div class ="full-title"></div>
					</div>
					<p class="timer"> минут</p>
				</div>
				<div class="price">
					<div class="likeOrDislike">
						<div class="post-rating-button material-icons liked1">thumb_up</div>
						<div class="post-rating-button material-icons disliked1">thumb_down</div>
					</div>
				</div>
			</div>
		</div>
		<div class="right-section">
			<form action="#">
				<input type="text" class="namedHim" placeholder="Название рецепта">
				<input type="number" placeholder="Время приготовления"" class="numberedHim">
				<input type="url" placeholder="ссылка на картинку" class="imgedHim">
				<textarea placeholder="Рецепты (через пробел)" class="readedHim"></textarea>
				<button type="submit" class="addedHim">Добавить</button>
			</form>
		</div>
		`
	)
	const namedHim = document.querySelector('.namedHim')
	const numberedHim = document.querySelector('.numberedHim')
	const imgedHim = document.querySelector('.imgedHim')
	const readedHim = document.querySelector('.readedHim')
	const addedHim = document.querySelector('.addedHim')
	namedHim.addEventListener('input', () => {
		if (namedHim.value.length > 12) {
			document.querySelector('.title1').innerText = namedHim.value.slice(0, 12) + '...'
		}
		else {
			document.querySelector('.title1').innerText = namedHim.value
		}
	})
	numberedHim.addEventListener('input', () => {
		document.querySelector('.timer').innerText = numberedHim.value.slice(0, 3) + ' минут'
	})
	imgedHim.addEventListener('input', () => {
		document.querySelector('.img').style.backgroundImage = `url(${imgedHim.value})`
	})
	console.log(document.querySelector('.img').style.backgroundImage)
	addedHim.addEventListener('click', async e => {
		if (namedHim.value.length < 1 || numberedHim.value.length < 1 || imgedHim.value.length < 1 || readedHim.value.length < 1) {
			alert('Заполните все поля')
		}
		else {
			try {
				console.log(readedHim.value.split(', '))
				let title = namedHim.value
				let price = numberedHim.value.slice(0, 3)
				let ingridients = readedHim.value.split(', ')
				let color = document.querySelector('.img').style.backgroundImage
				let likes = [0, false]
				let dislikes = [0, false]
				await postData('http://localhost:3000/PRODUCTS', {
					id: title.trim(''),
					title,
					price,
					ingridients,
					color,
					likes,
					dislikes
				}).then(response => {
					console.log(response, 'данные успешно добавлены')
				})
			} catch (error) {
				console.error(error)
			}
		}
	})
	container.classList.add('reverseContainer')
})

seeIt.addEventListener('click', async e => {
	e.preventDefault()
	try {
		const products = await getData('http://localhost:3000/PRODUCTS')
		h1.innerText = 'Все рецепты'
		container.innerHTML = ''
		container.classList.remove('reverseContainer')
		products.forEach(product => {
			container.insertAdjacentHTML(
				`beforeend`,
				`
				<li class="productItem">
					<div class="block-color">
						<div class="img" style="background-image: url(${product.color});">
							<span class="post-rating-button material-icons menu">reorder</span>
						</div>
					</div>
					<div class="text-info">
						<div class="title">
							<div class="title1">${
								product.title.length > 12
									? `${product.title.substring(0, 12)}...`
									: product.title
								}
								<div class ="full-title">${product.title}</div>
							</div>
							<p class="timer">${product.price} минут</p>
						</div>
						<div class="price">
							<div class="likeOrDislike">
								<div class="post-rating-button material-icons liked1" style="color: ${product.likes[1] == true
																										? 'red'
																										: 'white'};">
									thumb_up
									<div class="full-title">${product.likes[0]}</div>
								</div>
								<div class="post-rating-button material-icons disliked1" style="color: ${product.dislikes[1] == true
																										? 'red'
																										: 'white'};">
									thumb_down
									<div class="full-title">${product.dislikes[0]}</div>
								</div>
							</div>
						</div>
					</div>
				</li>
				`
			)	
		})
	} catch (error) {
		body.innerHTML = `<h1>${error}</h1>`
	}
})