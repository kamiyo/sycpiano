interface ContactItemShape {
    readonly name: string;
    readonly cssClass: string;
    readonly organization?: string;
    readonly phone?: string;
    readonly title: string;
    readonly email: string;
    readonly social: {
        readonly [key: string]: string;
    };
}

export default ContactItemShape;
