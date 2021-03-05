import axios from 'axios';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { pushed } from 'src/styles/mixins';
import { lato2, } from 'src/styles/fonts';

const Container = styled.div(
    pushed,
    {
        fontFamily: lato2,
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
        paddingTop: '2rem',
    },
);

interface FAQ {
    question: string;
    answer: string;
}

const FAQs: React.FC<Record<string, unknown>> = () => {
    const [faqs, setFaqs] = React.useState<FAQ[]>([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const {
                    data
                }: { data: FAQ[] } = await axios.get('/api/shop/faqs');

                setFaqs(data);
            } catch (e) {
                console.log(`Could not fetch faqs.`);
            }
        };

        fetchData();
    }, []);

    return (
        faqs && (
            <Container>
                <ul css={{ paddingRight: '1rem' }}>
                    {faqs.map((faq, idx) => (
                        <li key={idx}>
                            <ReactMarkdown
                                source={faq.question}
                                renderers={{
                                    paragraph: (props) => <div css={{ fontWeight: 'bold' }} {...props} />
                                }}
                            />
                            <ReactMarkdown
                                source={faq.answer}
                                renderers={{
                                    paragraph: (props) => <div css={{ padding: '1rem 0 1rem 1rem' }} {...props} />,
                                    link: ({ href, children }: { href: string, children: React.ReactNode }) => (
                                        (href.match('mailto') ?
                                            <a css={{ textDecoration: 'underline' }} href={href} children={children} />
                                            : <Link css={{ textDecoration: 'underline' }} to={href} children={children} />
                                        )
                                    ),
                                }}
                            />
                        </li>
                    ))}
                </ul>
            </Container>
        )
    );
};

export { FAQs }