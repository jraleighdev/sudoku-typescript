export class InputElement {

    public r: number;
    public c: number;
    public g: number;
    public i: number;
    public e: HTMLInputElement;

    constructor(element: HTMLInputElement) {
        let idStrings = element.id.split('@');
        this.i = +idStrings[0];
        this.r = +idStrings[1];
        this.c = +idStrings[2];
        this.g = +idStrings[3];
        this.e = element;
    }

    getValue = (): string => {
        return this.e.value;
    }

    setValue(value: string) {
        this.e.value = value;
    }
}