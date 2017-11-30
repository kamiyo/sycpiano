interface ContactItemShape {
    name: string;
    cssClass: string;
    organization?: string;
    phone?: string;
    title: string;
    email: string;
    social: {
        [key: string]: string;
    };
}

export default ContactItemShape;
