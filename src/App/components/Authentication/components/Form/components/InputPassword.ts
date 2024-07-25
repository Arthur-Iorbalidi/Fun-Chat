import Element from '../../../../../../utils/Element';
import InputElement from '../../../../../../utils/InputElement';

class InputPassword extends Element<HTMLDialogElement> {
    constructor() {
        super({ tag: 'div', cssClasses: ['inputPasswordWrapper'] });

        this.init();
    }

    public init() {
        const inputPassword = new InputElement({
            cssClasses: ['input', 'inputPassword'],
            placeholder: 'Password',
            onInput: this.validation,
        }).node;
        const mistakeMessagePassword = new Element({
            tag: 'div',
            cssClasses: ['mistakeMessage', 'mistakeMessagePassword'],
        }).node;

        this.append(inputPassword, mistakeMessagePassword);
    }

    private validation(event: Event) {
        const input = event.target as HTMLInputElement;
        const mistakeMessage = document.querySelector('.mistakeMessagePassword') as HTMLElement;
        const inputName = document.querySelector('.inputName') as HTMLInputElement;
        const submit = document.querySelector('.submit') as HTMLButtonElement;
        const minLength = 8;

        let message = '';

        if (input.value.length < minLength) {
            message += `Minimum size - ${minLength}. `;
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])/.test(input.value)) {
            message += 'Use lowercase and uppercase English letters and symbols. ';
        }
        if (!/[\W_]/.test(input.value)) {
            message += 'Use symbols.';
        }
        mistakeMessage.textContent = message;
        if (message === '' && /^(?=.*[A-Z])[a-zA-Z-]{4,}$/.test(inputName.value)) {
            submit.disabled = false;
        } else {
            submit.disabled = true;
        }
    }
}

export default InputPassword;
