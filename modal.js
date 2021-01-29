'use strict'

excludedCharactersDOM.addEventListener('click', () => {
    modal.classList.remove('hidden--smooth');
    modalContent.style.display = 'flex';
});

modalClose.addEventListener('click', () => {
    hideModal();
});

modalDoneBtn.addEventListener('click', () => {
    hideModal();
});

function hideModal() {
    modal.classList.add('hidden--smooth');
    modalContent.classList.remove('modal__content--animationHide');
    modalContent.style.display = 'none';
}