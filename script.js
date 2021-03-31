'use strict';

// SELECTORS
const generateBtn = document.getElementById('generateBtn');
const mainOutput = document.getElementById('output-main');
const outputs = document.getElementsByClassName('output__password');
const selections = document.querySelectorAll('.selection');
const pwdLength = document.getElementById('length');
const pwdAmount = document.getElementById('amount');
const copyMessage = document.getElementById('copyMessage');
const excludedCharactersDOM = document.getElementById('selection5');
let excludedCharactersInput = document.getElementById('excludedCharsInput');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const modalDoneBtn = document.getElementById('modalBtn');

let availableGroupsCount = 4;
let pass = [];
let excludedCharacters = '';

const availableGroups = new Map([
    [0, true],
    [1, true],
    [2, true],
    [3, true],
    [4, true]
]);

const chars = new Map([
    [0, 'abcdefghijklmnoprstuwyxz'],
    [1, 'ABCDEFGHIJKLMNOPRSTUWYXZ'],
    [2, '0123456789'],
    [3, `$@!?.,&*^%<>/"'~\`+-`],
    [4, '[]()'],
    ['excludedChars', '']
]);

modalDoneBtn.addEventListener('click', () => {
   excludedCharacters = excludedCharactersInput.value ? excludedCharactersInput.value.trim() : '';
   if(excludedCharacters) {
       excludedCharactersDOM.classList.remove('selection--disabled');
       chars.set('excludedChars', [...new Set(excludedCharacters.split(',').map(el => el.trim()))]);
       excludedCharactersDOM.textContent = `Excluded characters: ${chars.get('excludedChars').join(', ')}`;
       excludedCharacters = '';
   } else {
       chars.set('excludedChars', '');
       excludedCharacters = '';
       excludedCharactersDOM.classList.add('selection--disabled');
       excludedCharactersDOM.textContent = 'Excluded characters: none';
   }
});

const addCopy = function (el) {
    el.addEventListener('click', function () {
        const textarea = document.createElement('textarea');
        textarea.value = el.textContent;
        document.body.append(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();

        // Notification
        setTimeout(() => {
            copyMessage.classList.add('hidden--smooth');
        }, 1800);
        copyMessage.classList.remove('hidden--smooth');
    })
}

addCopy(mainOutput);

const optionsError = option => {
    option.setAttribute('disabled', true);
    setTimeout(function () {
        option.removeAttribute('disabled');
    }, 2000);
}

pwdLength.addEventListener('change', function () {
    const lengthValue = +pwdLength.value;
    if(lengthValue > 32) {
        optionsError(pwdLength);
        pwdLength.value = 32;
    } else if(lengthValue < 6) {
        optionsError(pwdLength)
        pwdLength.value = 6;
    }
});

pwdAmount.addEventListener('change', function () {
    const amountValue = +pwdAmount.value;
    if(amountValue > 20) {
        optionsError(pwdAmount);
        pwdAmount.value = 20;
    } else if(amountValue < 1) {
        optionsError(pwdAmount);
        pwdAmount.value = 1;
    }
})

const generatePassword = function () {
    pass = [];
    const localPass = [];
    while(localPass.length < +pwdLength.value) {
        const group = Math.trunc(Math.random() * 5);
        if(availableGroups.get(group)) {
            const randomNumber = Math.trunc(Math.random() * chars.get(group).length);
            if(!chars.get('excludedChars').includes(chars.get(group)[randomNumber])) localPass.push(chars.get(group)[randomNumber]);
        }
    }
    return localPass.join('');
};

selections.forEach(el => {
    el.addEventListener('click', () => {
        if(availableGroupsCount > 1 || el.classList.contains('selection--disabled')) {
            if(el.id !== 'selection5') {
                el.classList.toggle('selection--disabled');
                if (availableGroups.get(Number(el.id.substr(el.id.length - 1, 1)))) {
                    availableGroups.set(Number(el.id.substr(el.id.length - 1, 1)), false);
                } else {
                    availableGroups.set(Number(el.id.substr(el.id.length - 1, 1)), true);
                }
            }
        }

        // Count available groups
        availableGroupsCount = 0;
        for(const value of availableGroups.values()) {
            if(value === true) availableGroupsCount++;
        }
    });
});

generateBtn.addEventListener('click', function () {
    if(mainOutput.style.display === 'block') {
        const pseudoEl = document.createElement('span');
        pseudoEl.setAttribute('class', 'output__backgroundEl');
        pseudoEl.textContent = pass;
        document.querySelector('.output').appendChild(pseudoEl);
        setTimeout(() => {
            pseudoEl.remove();
        }, 750);
    }

    if(+pwdAmount.value > 1) {
        openModal();
        modalContent.innerHTML = '';
        const passwords = [];
        while(+pwdAmount.value > passwords.length) {
            passwords.push(generatePassword());
        }
        passwords.forEach(pwd => modalContent.innerHTML += `<span class='output__password'>${pwd}</span>`);
        modalContent.childNodes.forEach(el => addCopy(el));
        modalContent.style.height = modalContent.scrollHeight + parseFloat(getComputedStyle(modalContent).paddingTop) * 2 + 'px';
    } else {
        pass = generatePassword();
        mainOutput.style.display = 'block';
        mainOutput.textContent = pass;
    }
});

// MODAL
const openModal = function() {
    modal.classList.remove('hidden--smooth');
    modalContent.style.display = 'flex';
    modalContent.style.height = modalContent.scrollHeight + 'px';
}

const hideModal = function() {
    modal.classList.add('hidden--smooth');
    modalContent.classList.remove('modal__content--animationHide');
    modalContent.style.display = 'none';
}

modal.addEventListener('click', function (e) {
    if(e.target === modal) hideModal();
});

document.addEventListener('keypress', function (e) {
    if(!modal.classList.contains('hidden--smooth') && e.code === 'Enter') modalDoneBtn.click();
});

modalDoneBtn.addEventListener('click', hideModal);
excludedCharactersDOM.addEventListener('click', openModal);
