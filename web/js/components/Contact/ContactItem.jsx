import '@/less/contact-item.less';
import React from 'react';

export default class ContactItem extends React.Component {
    render() {
        return (
            <div className='contactItem'>
                <div className={'contactImage ' + this.props.cssClass}>
                </div>
                <div className='contactInfo'>
                    <div className='personalInfo'>
                        <div className='name'>{this.props.name}</div>
                        <div className='subInfo'>
                            <div className='title'>{this.props.title}</div>
                            {(() => {
                                if (this.props.organization) {
                                    return <div className='organization'>{this.props.organization}</div>
                                }
                            })()}
                        </div>
                    </div>
                    <div className='divider'></div>
                    <div className='personalContact'>
                        {(() => {
                            if (this.props.phone) {
                                return <div className='phone'>{this.props.phone}</div>
                            }
                        })()}
                        <div className='email'>
                            <a href={`mailto:${this.props.email}`}>{this.props.email}</a>
                        </div>
                    </div>
                </div>
                <div className='contactSocial'>
                    {Object.keys(this.props.social).map(function(site, i) {
                        return (
                            <a className='socialLink' key={i} href={this.props.social[site]}>
                                <object
                                    className='{site}'
                                    type='image/svg+xml'
                                    data={'/images/soc-logos/' + site + '-color.svg'} />
                            </a>
                        );
                    }.bind(this))}
                </div>
            </div>
        )
    }
};