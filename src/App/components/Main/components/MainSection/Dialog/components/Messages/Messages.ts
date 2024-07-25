import { container } from 'tsyringe';
import CurrentRecipient, { CurrentRecipientActions } from '../../../../../../../../services/currentRecipient';
import Element from '../../../../../../../../utils/Element';
import './Messages.scss';
import WebSocketService, { Request, Response, WebSocketActions, message } from '../../../../../../../../services/WebSocketService';

class Messages extends Element<HTMLDivElement> {
    private webSocketService: WebSocketService = container.resolve(WebSocketService);
    
    private currentRecipient: CurrentRecipient = container.resolve(CurrentRecipient);

    constructor() {
        super({ tag: 'section', cssClasses: ['messages'] });
        this.addEventListener({type: 'click', callback: this.sendReadStatusRequest.bind(this)});
        // this.addEventListener({type: 'scroll', callback: this.sendReadStatusRequest.bind(this)});

        this.init();
        this.currentRecipient.subscribe(CurrentRecipientActions.CHANGE_RECIPIENT, this.sendMessageHistoryRequest.bind(this));
        this.webSocketService.subscribe(WebSocketActions.MSG_SEND, this.getMessage.bind(this));
        this.webSocketService.subscribe(WebSocketActions.MSG_FROM_USER, this.drawHistory.bind(this));
        this.webSocketService.subscribe(WebSocketActions.MSG_DELIVER, this.changeStatus.bind(this));
        this.webSocketService.subscribe(WebSocketActions.MSG_READ, this.changeStatus.bind(this));
    }

    private init() {
        const greetingMessage = new Element({
            tag: 'span',
            cssClasses: ['greetingMessage'],
            content: 'Select a user to send a message...',
        }).node;

        this.append(greetingMessage);
    }

    private createGreeting() {
        const greeting = new Element({
            tag: 'span',
            cssClasses: ['greetingMessage'],
            content: 'Write you first message...',
        }).node;

        this.append(greeting);
    }

    private drawMessage(message: message) {
        const container = new Element({
            tag: 'div',
            cssClasses: message?.from === this.currentRecipient.currentRecipient.login ? ['containerMessage', 'recipient'] : ['containerMessage', 'yours'],
            attributes: {
                'data-id': message.id,
                'data-isReaded': message.status.isReaded.toString(),
            }
        }).node;

        const messageBlock = new Element({
            tag: 'div',
            cssClasses: ['message'],
        }).node;


        const messageHeader = new Element({
            tag: 'div',
            cssClasses: ['messageHeader'], 
        }).node;
        const sender = new Element({
            tag: 'span',
            cssClasses: ['sender'], 
            content: message?.from === this.currentRecipient.currentRecipient.login ? message.from : 'you',
        }).node;

        const time = new Element({
            tag: 'span',
            cssClasses: ['time'],
            content: this.getFormattedDate(message.datetime),
        }).node;

        const text = new Element({
            tag: 'div',
            cssClasses: ['text'],
            content: message?.text,
        }).node;

        const messageFooter = new Element({
            tag: 'div',
            cssClasses: ['messageFooter'], 
        }).node;
        const isChanged = new Element({
            tag: 'div',
            cssClasses: ['isChanged'],
            content: message?.status.isEdited ? 'edited' : '',
        }).node;

        let statusText = '';
        if(this.currentRecipient.currentRecipient.login !== message.from) {
            statusText = 'sent';
            if(message?.status.isDelivered) {
                statusText = 'delivered';
                if(message?.status.isReaded) {
                    statusText = 'readed';
                }
            }
        }

        const status = new Element({
            tag: 'div',
            cssClasses: ['status'], 
            content: statusText,
        }).node;

        messageHeader.append(sender, time);
        messageFooter.append(isChanged, status);
        messageBlock.append(messageHeader, text, messageFooter);
        container.append(messageBlock);

        this.append(container);
    }

    private getMessage(response: Response) {
        if(this.currentRecipient.currentRecipient.login === response.payload.message?.to || this.currentRecipient.currentRecipient.login === response.payload.message?.from) {
            this.node.querySelector('.greetingMessage')?.remove();

            this.drawMessage(response.payload.message as message);

            this.node.scrollTop = this.node.scrollHeight;
        }
        
        if(this.currentRecipient.currentRecipient.login !== response.payload.message?.from) {
            this.sendReadStatusRequest();
        }
    }

    private drawHistory(response: Response) {
        this.cleanMessages();

        const messages = response.payload.messages;

        if(messages?.length === 0) {
            this.createGreeting();
        }

        messages?.forEach((message) => {
            this.drawMessage(message);
        });

        this.node.scrollTop = this.node.scrollHeight;
    }

    private cleanMessages() {
        const messages = document.querySelector('.messages') as HTMLElement;
        messages.innerHTML = '';
    }

    private sendMessageHistoryRequest() {
        const request: Request = {
            id: '0',
            type: WebSocketActions.MSG_FROM_USER,
            payload: {
              user: {
                login: this.currentRecipient.currentRecipient.login,
              }
            }
        }

        this.webSocketService.send(request);
    }

    private getFormattedDate(timeStamp: number) {
        const date = new Date(timeStamp);
        const formattedDate = `${padZero(date.getDate())}.${padZero(date.getMonth() + 1)}.${date.getFullYear()}`;
        const formattedTime = `${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;

        return `${formattedDate}, ${formattedTime}`;

        function padZero(num: number) {
            return num < 10 ? `0${num}` : num;
        }
    }

    private changeStatus(response: Response) {
        const message = document.querySelector(`[data-id="${response.payload.message?.id}"]`);

        if(message) {
            const status = message?.querySelector('.status') as HTMLElement;
            if(response.payload.message?.status.isDelivered) {
                status.textContent = 'delivered';
            }
            if(response.payload.message?.status.isReaded && message.classList.contains('yours')) {
                status.textContent = 'readed';
            }
        }
    }

    private sendReadStatusRequest() {
        const messages = document.querySelectorAll('.recipient[data-isReaded="false"]');

        messages.forEach((message) => {
            const messageId = message.getAttribute('data-id') as string;

            const request: Request = {
                id: '0',
                type: "MSG_READ",
                payload: {
                  message: {
                    id: messageId,
                  }
                }
            }

            this.webSocketService.send(request);
        });
    }
}

export default Messages;
