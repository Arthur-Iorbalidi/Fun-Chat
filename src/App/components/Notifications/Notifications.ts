import Element from '../../../utils/Element';
import './Notifications.scss';

class Notifications {
    public createLoadingMessage(contentMsg: string = 'Loading...') {
        if (document.querySelector('.messageBackground')) {
            return;
        }

        const messageLoadingBackground = new Element({
            tag: 'div',
            cssClasses: ['messageBackground', 'messageLoadingBackground'],
        }).node;
        const messageLoadingWrapper = new Element({
            tag: 'div',
            cssClasses: ['messageWrapper', 'messageLoadingWrapper'],
        }).node;
        const iconLoading = new Element({
            tag: 'img',
            cssClasses: ['iconLoading'],
            attributes: { src: 'assets/icons/loading.svg' },
        }).node;
        const message = new Element({
            tag: 'div',
            cssClasses: ['message'],
            content: contentMsg,
        }).node;

        messageLoadingWrapper.append(iconLoading, message);
        messageLoadingBackground.append(messageLoadingWrapper);
        document.body.append(messageLoadingBackground);
    }

    public createErrorMessage(error: string) {
        if (document.querySelector('.messageErrorBackground')) {
            return;
        }

        const messageBackground = new Element({
            tag: 'div',
            cssClasses: ['messageBackground', 'messageErrorBackground'],
        }).node;
        const messageErrorWrapper = new Element({
            tag: 'div',
            cssClasses: ['messageWrapper', 'messageErrorWrapper'],
        }).node;
        const message = new Element({
            tag: 'div',
            cssClasses: ['message'],
            content: error,
        }).node;
        const btnClose = new Element({
            tag: 'button',
            cssClasses: ['btnClose'],
            content: 'Ok',
            event: {
                type: 'click',
                callback: this.removeErrorMessage,
            },
        }).node;

        messageErrorWrapper.append(message, btnClose);
        messageBackground.append(messageErrorWrapper);
        document.body.append(messageBackground);
    }

    public removeLoadingMessage() {
        document.querySelector('.messageLoadingBackground')?.remove();
    }

    private removeErrorMessage() {
        document.querySelector('.messageErrorBackground')?.remove();
    }
}

export default Notifications;
