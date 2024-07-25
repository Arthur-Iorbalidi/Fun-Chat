import Element, { ElemParameters } from './Element';

export interface IInputParameters extends Omit<ElemParameters, 'tag'> {
    placeholder?: string;
    value?: string;
    onInput?: (event: Event) => void;
}

class InputElement extends Element<HTMLInputElement> {
    constructor(parameters: IInputParameters) {
        super({ ...parameters, tag: 'input' });
        this.setInputParams(parameters);
    }

    private setInputParams(parameters: IInputParameters) {
        if (parameters.hasOwnProperty('placeholder')) {
            this.node.placeholder = parameters.placeholder as string;
        }
        if (parameters.hasOwnProperty('value')) {
            this.node.value = parameters.value as string;
        }
        if (parameters.hasOwnProperty('onInput')) {
            this.node.addEventListener('input', parameters.onInput as (event: Event) => void);
        }
    }

    public reset() {
        this.node.value = '';
    }
}

export default InputElement;
