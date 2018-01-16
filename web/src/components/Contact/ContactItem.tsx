import 'less/Contact/contact-item.less';

import * as React from 'react';

import ContactItemShape from 'src/components/Contact/types';

const ContactItem: React.SFC<ContactItemShape> = ({
    cssClass,
    name,
    title,
    organization,
    phone,
    email,
    social,
}) => (
    <div className="contactItem">
        <div className={`contactImage ${cssClass}`} />

        <div className="contactInfo">
            <div className="personalInfo">
                <div className="name">{name}</div>

                <div className="subInfo">
                    <div className="title">{title}</div>
                    {
                        organization &&
                        <div className="organization">
                            {organization}
                        </div>
                    }
                </div>
            </div>

            <div className="divider" />
            <div className="personalContact">
                {phone && <div className="phone"><div>{phone}</div></div>}

                <div className="email">
                    <a href={`mailto:${email}`}>{email}</a>
                </div>
            </div>
        </div>

        <div className="contactSocial">
            {
                Object.keys(social).map((site, i) => (
                    <div className="socialLinkContainer" key={i}>
                        <a className="socialLink" href={social[site]} target="_blank">
                            <img
                                className={site}
                                src={`/images/soc-logos/${site}-color.svg`}
                            />
                        </a>
                    </div>
                ))
            }
        </div>
    </div>
);

export default ContactItem;
