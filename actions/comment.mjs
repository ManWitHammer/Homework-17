const commentss = () => {
    const getData = url =>
	new Promise((resolve, reject) =>
		fetch(url)
			.then(response => response.json())
			.then(json => resolve(json))
			.catch(error => reject(error))
	)
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
    const reception = document.querySelector('.allRec')
    const recH1 = document.querySelector('.reception h1')
    const commentButtons = document.querySelectorAll('.commented')
		commentButtons.forEach(commentButton => {
			commentButton.addEventListener('click', async e => {
                const products = await getData('http://localhost:3000/PRODUCTS')
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
}

export default commentss