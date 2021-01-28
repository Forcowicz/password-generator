'use strict';

const generateBtn = document.getElementById('generateBtn');
const output = document.getElementById('output');
const selections = document.querySelectorAll('.selection');
const arrowUp = document.getElementById('arrowUp');
const arrowDown = document.getElementById('arrowBottom');
const switchText = document.getElementById('switchText');
const copyMessage = document.getElementById('copyMessage');

let availableGroupsCount = 4;
let passLength = 16;
let pass = [];

const availableGroups = new Map([
    [0, true],
    [1, true],
    [2, true],
    [3, true]
]);

const chars = new Map([
    [0, 'abcdefghijklmnoprstuwyxz'],
    [1, 'ABCDEFGHIJKLMNOPRSTUWYXZ'],
    [2, '0123456789'],
    [3, '$@!?.,&*^%()']
]);

output.addEventListener('click', () => {
   const textarea = document.createElement('textarea');
   document.querySelector('body').appendChild(textarea);
   textarea.setAttribute('display', 'none');
   textarea.value = pass;
   textarea.select();
   document.execCommand('copy');
   textarea.remove();

   setTimeout(() => {
       copyMessage.classList.add('hidden--smooth');
   }, 1000);
   copyMessage.classList.remove('hidden--smooth');
});

const arrowError = function (arrow) {
    setTimeout(() => {
        arrow.classList.remove('switch__arrow--error');
        arrow.removeAttribute('disabled');
    }, 1000);
    arrow.classList.add('switch__arrow--error');
}

arrowUp.addEventListener('click', () => {
    if(passLength < 32 && !arrowUp.classList.contains('switch__arrow--error')) {
        passLength++;
        switchText.textContent = String(passLength);
    } else {
        arrowError(arrowUp);
    }
});

arrowDown.addEventListener('click', () => {
   if(passLength > 6) {
       passLength--;
       switchText.textContent = String(passLength);
   } else {
       arrowError(arrowDown);
   }
});

const generatePassword = function () {
    pass = [];
    while(pass.length < passLength) {
        const group = Math.trunc(Math.random() * 4);
        if(availableGroups.get(group)) {
            const randomNumber = Math.trunc(Math.random() * chars.get(group).length);
            pass.push(chars.get(group)[randomNumber]);
        }
    }
    pass = pass.join('');
};

selections.forEach(el => {
    el.addEventListener('click', () => {
        if(availableGroupsCount > 1 || el.classList.contains('selection--disabled')) {
            el.classList.toggle('selection--disabled');
            if(availableGroups.get(Number(el.id.substr(el.id.length - 1, 1)))) {
                availableGroups.set(Number(el.id.substr(el.id.length - 1, 1)), false);
            } else {
                availableGroups.set(Number(el.id.substr(el.id.length - 1, 1)), true);
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
    if(output.style.display === 'block') {
        const pseudoEl = document.createElement('span');
        pseudoEl.setAttribute('class', 'output__backgroundEl');
        pseudoEl.textContent = pass;
        document.querySelector('.output').appendChild(pseudoEl);
        setTimeout(() => {
            pseudoEl.remove();
        }, 750);
    }

    generatePassword();
    output.style.display = 'block';
    output.textContent = pass;
});