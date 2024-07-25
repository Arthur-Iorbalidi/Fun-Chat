import Element from '../../../../../utils/Element';
import './Footer.scss';

class Footer extends Element<HTMLDivElement> {
    constructor() {
        super({ tag: 'footer', cssClasses: ['footer'] });

        this.init();
    }

    private init() {
        const schoolLogo = new Element({
            tag: 'img',
            cssClasses: ['schoolLogo'],
            attributes: {
                src: 'assets/imgs/schoolLogo.png',
            },
        }).node;

        const authorName = new Element({
            tag: 'a',
            cssClasses: ['authorName'],
            content: 'Arthur-Iorbalidi',
            attributes: {
                href: 'https://github.com/Arthur-Iorbalidi',
            },
        }).node;

        const appYear = new Element({
            tag: 'span',
            cssClasses: ['appYear'],
            content: '2024',
        }).node;

        this.append(schoolLogo, authorName, appYear);
    }
}

export default Footer;
