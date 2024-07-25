import { container } from 'tsyringe';
import Element from '../../../utils/Element';
import './About.scss';
import Router from '../../../services/router';

class About extends Element<HTMLDivElement> {
    private appName = 'Fun-Chat';

    private authorName = 'Arthur-Iorbalidi';

    private description = 'The application is designed to demonstrate the Fun-Chat task as part of the RSSchool JS/FE 2023Q4 course';

    private router = container.resolve(Router);

    constructor() {
        super({ tag: 'div', cssClasses: ['aboutWrapper'] });

        this.init();
    }

    private init() {
        const container = new Element({
            tag: 'div',
            cssClasses: ['container'],
        }).node;

        const title = new Element({
            tag: 'h1',
            cssClasses: ['title'],
            content: this.appName,
        }).node;

        const description = new Element({
            tag: 'p',
            cssClasses: ['description'],
            content: this.description,
        }).node;

        const author = new Element({
            tag: 'a',
            cssClasses: ['author'],
            attributes: {
                href: 'https://github.com/Arthur-Iorbalidi',
            },
            content: `Author: ${this.authorName}`,
        }).node;

        const backBtn = new Element({
            tag: 'button',
            cssClasses: ['backBtn'],
            content: 'Back',
            event: {
                type: 'click',
                callback: this.toAuthorization.bind(this),
            },
        }).node;

        container.append(title, description, author, backBtn);
        this.append(container);
    }

    private toAuthorization() {
        this.router.navigateBack();
    }
}

export default About;
