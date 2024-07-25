import Element from '../../../../../../utils/Element';
import InputElement from '../../../../../../utils/InputElement';

class InputName extends Element<HTMLDialogElement> {
    constructor() {
        super({ tag: 'div', cssClasses: ['inputNameWrapper'] });

        this.init();
    }

    public init() {
        const inputName = new InputElement({
            cssClasses: ['input', 'inputName'],
            placeholder: 'Name',
            onInput: this.validation,
        }).node;
        const mistakeMessageName = new Element({
            tag: 'div',
            cssClasses: ['mistakeMessage', 'mistakeMessageName'],
        }).node;

        this.append(inputName, mistakeMessageName);
    }

    private validation(event: Event) {
        const input = event.target as HTMLInputElement;
        const mistakeMessage = document.querySelector('.mistakeMessageName') as HTMLElement;
        const inputPassword = document.querySelector('.inputPassword') as HTMLInputElement;
        const submit = document.querySelector('.submit') as HTMLButtonElement;
        const minLength = 4;

        let message = '';

        if (!/^[A-Z].*/.test(input.value)) {
            message += 'The first letter must be capitalized and English';
        } else {
            if (input.value.length < minLength) {
                message += `Minimum size - ${minLength}`;
            }
            if (!/^[a-zA-Z]+$/.test(input.value)) {
                message += 'English alphabet and "-" are allowed';
            }
        }
        mistakeMessage.textContent = message;
        if (message === '' && /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(inputPassword.value)) {
            submit.disabled = false;
        } else {
            submit.disabled = true;
        }
    }
}

export default InputName;
