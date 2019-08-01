import { ErrorMessage, Field, Form, Formik, FormikActions } from 'formik';
import * as React from 'react';
import { connect } from 'react-redux';
import { CardElement, injectStripe, ReactStripeElements } from 'react-stripe-elements';
import { GlobalStateShape } from 'src/types';
import { checkoutSubmitAction } from './actions';
import { StoreCart } from './types';

interface StoreCheckoutFormOwnProps {
    readonly className?: string;
}

interface StoreCheckoutFormStateToProps {
    readonly cart: StoreCart;
    readonly isSubmitting: boolean;
    readonly submitSuccess: boolean;
}

interface StoreCheckoutFormDispatchToProps {
    readonly checkoutSubmitAction: typeof checkoutSubmitAction;
}

type StoreCheckoutFormProps =
    StoreCheckoutFormOwnProps
    & StoreCheckoutFormStateToProps
    & StoreCheckoutFormDispatchToProps
    & ReactStripeElements.InjectedStripeProps;

interface FormValues {
    readonly name: string;
    readonly email: string;
}

const getSubmitHandler = (
    stripe: ReactStripeElements.StripeProps,
    skuIds: string[],
    checkoutSubmit: typeof checkoutSubmitAction,
) => (values: FormValues) => {
    const tokenPromise = stripe.createToken({ name: values.name });
    checkoutSubmit(skuIds, tokenPromise);
};

const StoreCheckoutForm: React.FC<StoreCheckoutFormProps> = (props) => {
    const { className, cart, stripe, isSubmitting } = props;
    const checkoutSubmit = props.checkoutSubmitAction;
    return (
        <div className={className}>
            <Formik
                initialValues={{ name: '', email: '' }}
                onSubmit={getSubmitHandler(stripe, cart.items, checkoutSubmit)}
                render={() => (
                    <Form>
                        <Field type="text" name="name" />
                        <Field type="email" name="email" />
                        <ErrorMessage name="email" component="div" />
                        <CardElement />
                        <button disabled={isSubmitting}>Checkout</button>
                    </Form>
                )}
            />
        </div>
    );
};

const mapStateToProps = ({ sycStore }: GlobalStateShape) => ({
    cart: sycStore.cart,
    isSubmitting: sycStore.isSubmitting,
    submitSuccess: sycStore.submitSuccess,
});

const connectedStoreCheckoutForm = connect<StoreCheckoutFormStateToProps, StoreCheckoutFormDispatchToProps, {}>(
    mapStateToProps,
    { checkoutSubmitAction },
)(injectStripe(StoreCheckoutForm));

export default connectedStoreCheckoutForm;
