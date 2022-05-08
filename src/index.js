console.log('script enabled')

const soundBtns = document.querySelectorAll('.controls__sound')

soundBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		let utterance
		const parentContainer = btn.parentElement.parentElement
		const textArea = parentContainer.querySelector('textarea')
		utterance = new SpeechSynthesisUtterance(textArea.value)
		utterance.lang = 'en-US'
		speechSynthesis.speak(utterance)
	})
})