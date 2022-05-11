console.log('script enabled')

const soundBtns = document.querySelectorAll('.controls__sound')

const translationBtn = document.querySelector('#translate')

import { countries } from './langs.js'

const selectFrom = document.querySelector('#langFrom')
const selectTo = document.querySelector('#langTo')

const translateFrom = document.querySelector('#translateFrom')
const translateTo = document.querySelector('#translateTo')




	const translation = async(str,from,to) => {
		try {
			const request = await fetch(`https://api.mymemory.translated.net/get?q=${str}&langpair=${from}|${to}`)
			if(request.ok && request.status === 200) {
				const data = await request.json()
				return data
			} else throw new Error('kaka-to shnyaga')
		}
		catch(err) {
			console.log(err)
		}
	}

	const setLanguagesLists = (countries) => {
		for (let [code, name] of Object.entries(countries)) {
			selectFrom.insertAdjacentHTML('beforeend',
			`<option value="${code}">${name}</option>`
			)
			selectTo.insertAdjacentHTML('beforeend',
			`<option value="${code}">${name}</option>`
			)
		}
	}


soundBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		let utterance
		const parentContainer = btn.parentElement.parentElement
		const textArea = parentContainer.querySelector('textarea')
		utterance = new SpeechSynthesisUtterance(textArea.value)
		const lang = parentContainer.querySelector('select').value
		utterance.lang = lang
		speechSynthesis.speak(utterance)
	})
})

translationBtn.addEventListener('click', async() => {
	const str = translateFrom.value.trim()
	const langFrom = selectFrom.value
	const langTo = selectTo.value
	const data = await translation(str,langFrom,langTo)
	let output
	if (data) {
		output = data.responseData.translatedText
	} else {
		output = 'Ошибка перевода'
	}
	translateTo.value = output
})

setLanguagesLists(countries)