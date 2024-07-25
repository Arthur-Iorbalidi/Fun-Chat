import Element from '../../../../../utils/Element';
import Contacts from './Contacts/Contacts';
import Dialog from './Dialog/Dialog';
import './MainSection.scss';

class MainSection extends Element<HTMLDivElement> {
    constructor() {
        super({ tag: 'section', cssClasses: ['mainSection'] });

        this.init();
    }

    private init() {
        this.append(new Contacts().node, new Dialog().node);
    }
}

export default MainSection;
