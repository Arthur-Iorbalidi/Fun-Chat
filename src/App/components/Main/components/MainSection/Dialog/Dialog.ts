import Element from '../../../../../../utils/Element';
import './Dialog.scss';
import FormMessage from './components/FormMessage/FormMessage';
import Messages from './components/Messages/Messages';
import Recipient from './components/Recipient/Recipient';

class Dialog extends Element<HTMLDivElement> {
    constructor() {
        super({ tag: 'aside', cssClasses: ['dialog'] });

        this.init();
    }

    private init() {
        this.append(new Recipient().node, new Messages().node, new FormMessage().node);
    }
}

export default Dialog;
