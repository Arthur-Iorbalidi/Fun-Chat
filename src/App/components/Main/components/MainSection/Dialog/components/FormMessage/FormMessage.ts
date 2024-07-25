import { container } from 'tsyringe';
import CurrentRecipient, { CurrentRecipientActions } from '../../../../../../../../services/currentRecipient';
import Element from '../../../../../../../../utils/Element';
import InputElement from '../../../../../../../../utils/InputElement';
import './FormMessage.scss';
import WebSocketService, { Request, WebSocketActions } from '../../../../../../../../services/WebSocketService';

class FormMessage extends Element<HTMLFormElement> {
    private currentRecipient: CurrentRecipient = container.resolve(CurrentRecipient);

    private webSocketService: WebSocketService = container.resolve(WebSocketService);

    constructor() {
        super({ tag: 'form', cssClasses: ['formMessage'] });
        this.addEventListener({ type: 'submit', callback: this.sendMessage.bind(this) });

        this.init();
        this.currentRecipient.subscribe(CurrentRecipientActions.CHANGE_RECIPIENT, this.enableForm.bind(this));
    }

    private init() {
        const input = new InputElement({
            cssClasses: ['inputMessage'],
            placeholder: 'Enter you message',
            attributes: {
                disabled: '',
            },
            onInput: this.validation,
        }).node;

        const buttonSend = new Element({
            tag: 'button',
            cssClasses: ['buttonSend'],
            content: 'Send',
            attributes: {
                disabled: '',
            },
        }).node;

        this.append(input, buttonSend);
    }

    private enableForm() {
        const input = this.node.querySelector('.inputMessage') as HTMLElement;

        input.removeAttribute('disabled');
    }

    private validation(event: Event) {
        const input = event.currentTarget as HTMLInputElement;
        const btn = document.querySelector('.buttonSend') as HTMLButtonElement;

        if (input.value !== '') {
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }
    }

    private sendMessage(event: Event) {
        event.preventDefault();

        const input = document.querySelector('.inputMessage') as HTMLButtonElement;

        const request: Request = {
            id: '0',
            type: WebSocketActions.MSG_SEND,
            payload: {
              message: {
                to: this.currentRecipient.currentRecipient.login,
                text: input.value,
              }
            }
        }

        input.value = '';
        const btnSend = document.querySelector('.buttonSend') as HTMLButtonElement;
        btnSend.disabled = true;

        this.webSocketService.send(request);
    }
}

export default FormMessage;
