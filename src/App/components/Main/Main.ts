import Element from '../../../utils/Element';
import './Main.scss';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import MainSection from './components/MainSection/MainSection';

class Main extends Element<HTMLDivElement> {
    constructor() {
        super({ tag: 'div', cssClasses: ['mainWrapper'] });

        this.init();
    }

    public init() {
        const container = new Element({
            tag: 'div',
            cssClasses: ['container'],
        }).node;

        container.append(new Header().node, new MainSection().node, new Footer().node);

        this.append(container);
    }
}

export default Main;
