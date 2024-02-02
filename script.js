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

const body = document.querySelector('body')
const container = document.querySelector('.container')
const h1 = document.querySelector('h1')
const postBtn = document.querySelector('.create-product button')
const prokrutka = document.querySelector('.post')
const seeIt = document.querySelector('.seeIt')
const addIt = document.querySelector('.addIt')
const reception = document.querySelector('.allRec')
const recH1 = document.querySelector('.reception h1')
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
									<div class="post-rating-button material-icons searched">search Посмотреть ингридиенты</div>
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
					const id = likeButton.parentElement.parentElement.parentElement.querySelector('.title')
                                    .querySelector('.title1').querySelector('.full-title').innerText

					const response = await fetch(`http://localhost:3000/PRODUCTS/${id}`);
					const product = await response.json()
					if (product.dislikes[1]) {
						  product.dislikes[0]--
						  product.dislikes[1] = false;
					}
								  
					if (!product.likes[1]) {
						product.likes[0]++
					    product.likes[1] = true
						  
					}
					
					else {
						product.likes[0]--
						product.likes[1] = false
					}
						  
					const patchResponse = await fetch(`http://localhost:3000/PRODUCTS/${id}`, {
					    method: 'PATCH',
						body: JSON.stringify({
							likes: product.likes,
							dislikes: product.dislikes
						}),
						headers: { 'Content-Type': 'application/json' }
					})
						  
					const updatedProduct = await patchResponse.json();
					console.log(updatedProduct)

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
					const id = likeButton.parentElement.parentElement.parentElement.querySelector('.title')
                                    .querySelector('.title1').querySelector('.full-title').innerText
					
					const response = await fetch(`http://localhost:3000/PRODUCTS/${id}`);
					const product = await response.json()
					if (product.likes[1]) {
						product.likes[0]--
						product.likes[1] = false
					}

					if (!product.dislikes[1]) {
					  product.dislikes[0]++
					  product.dislikes[1] = true
					}

					else {
					  product.dislikes[0]--
					  product.dislikes[1] = false
					}
								  
					const patchResponse = await fetch(`http://localhost:3000/PRODUCTS/${id}`, {
					    method: 'PATCH',
						body: JSON.stringify({
							likes: product.likes,
							dislikes: product.dislikes
						}),
						headers: { 'Content-Type': 'application/json' }
					})
						  
					const updatedProduct = await patchResponse.json();
					console.log(updatedProduct)
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
		const searchButtons = document.querySelectorAll('.searched')
		searchButtons.forEach(searchButton => {
			searchButton.addEventListener('click', async e => {
				e.preventDefault()
				const id = searchButton.parentElement.parentElement.parentElement.parentElement.parentElement
				.querySelector('.text-info .title .title1 .full-title').innerText
				let newProd = products.filter(el => el.id == id)
				reception.innerHTML = ''
				console.log(newProd[0].ingridients)
				recH1.innerText = `Ингридиенты для ${newProd[0].title}`
				reception.insertAdjacentHTML(`beforeend`, 
				`
				${newProd[0].ingridients.map(el => `<li class>${el}</li>`).join('')}
				`
				)
			})
		})
		const commentButtons = document.querySelectorAll('.commented')
		commentButtons.forEach(commentButton => {
			commentButton.addEventListener('click', async e => {
				e.preventDefault()
				const id = commentButton.parentElement.parentElement.parentElement.parentElement.parentElement
				.querySelector('.text-info .title .title1 .full-title').innerText
				let newProd = products.filter(el => el.id == id)
				reception.innerHTML = ''
				console.log(newProd[0].comments)
				recH1.innerText = `Комментарии ${newProd[0].title}`
				reception.insertAdjacentHTML(`beforeend`, 
				`
				${newProd[0].comments[0].map(el => `<li class="comments">${el}</li>`).join('')}
				<form id="commentsForm">
					<textarea id="commentsInput"></textarea>
					<button type="submit">Отправить</button>
				</form>
				`
				)
				const addComment = document.querySelector('.reception button')
				addComment.addEventListener('click', async e => {
					let now = new Date()
					e.preventDefault()
					const id = newProd[0].title
					console.log(id)
					const allCom = newProd[0].comments[0]
					const tOrF = newProd[0].comments[0]
					if (document.querySelector('#commentsInput').value.length > 0) {
						allCom.push(`<h4>User1 | <span> ${now.getDate()}/${now.getMonth()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}</span></h4><p>${document.querySelector('#commentsInput').value}</p>`)
					}
					await patchData(`http://localhost:3000/PRODUCTS/${id}`, {comments: [allCom, tOrF]}).then(response => {
							console.log(response, 'данные успешно обновлены')
						})
				})
					const commentContainers = document.querySelectorAll('.comments');
					commentContainers.forEach(commentContainer => {
						commentContainer.addEventListener('dblclick', () => {
						const thisEl = commentContainer.innerHTML
						commentContainer.insertAdjacentHTML('beforeend', `
							<input class="yohoo" type="text" value="${commentContainer.querySelector('p').innerText}">
							<button class="edited" type="submit">Отправить</button>
						`);
						

						const input1 = commentContainer.querySelector('.yohoo');
						console.log(input1);

						input1.addEventListener('input', () => {
							commentContainer.querySelector('p').innerText = input1.value
						})
						const editButton = commentContainer.querySelector('.edited');
						editButton.addEventListener('click', async e => {
							e.preventDefault()
							let now = new Date()
							const id = newProd[0].title
							console.log(id)
							const allCom = newProd[0].comments[0]
							const tOrF = newProd[0].comments[1]
							let filtCom = allCom.findIndex(el => el == thisEl)
							
							if (input1.value.length > 0) {
								allCom[filtCom] = `<h4>User1 | <span> ${now.getDate()}/${now.getMonth()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}</span></h4><p>${input1.value}(Ред.)</p>`
							}
							console.log(allCom)
							await patchData(`http://localhost:3000/PRODUCTS/${id}`, {comments: [allCom, tOrF]}).then(response => {
								console.log(response, 'данные успешно обновлены')
							})
						})
					})
				});
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
				let comments = []
				await postData('http://localhost:3000/PRODUCTS', {
					id: title.trim(''),
					title,
					price,
					ingridients,
					color,
					likes,
					dislikes,
					comments
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