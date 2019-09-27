export interface PersonalInfoShape {
    className?: string;
    organization?: string;
    name: string;
    title: string;
}

export interface PersonalContactShape {
    className?: string;
    phone?: string;
    email: string;
    website?: string;
}

export interface ContactSocialMediaShape {
    className?: string;
    social: { [key: string]: string };
}

export type ContactItemShape = (
    PersonalInfoShape
    & PersonalContactShape
    & ContactSocialMediaShape
    & {
        isMobile?: boolean;
    }
);
