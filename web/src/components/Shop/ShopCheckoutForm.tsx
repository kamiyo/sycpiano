import {
    ErrorMessage,
    Field,
    Form,
    Formik,
    // FormikActions,
} from 'formik';

import * as React from 'react';
import { connect } from 'react-redux';
import { CardElement, injectStripe, ReactStripeElements } from 'react-stripe-elements';

import { checkoutSubmitAction } from './actions';
import { ShoppingCart } from './types';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { GlobalStateShape } from 'src/types';

interface ShopCheckoutFormOwnProps {
    readonly className?: string;
}

interface ShopCheckoutFormStateToProps {
    readonly cart: ShoppingCart;
    readonly isSubmitting: boolean;
    readonly submitSuccess: boolean;
}

interface ShopCheckoutFormDispatchToProps {
    readonly checkoutSubmitAction: (skuIds: string[], tokenPromise: Promise<ReactStripeElements.PatchedTokenResponse>) => Promise<void>;
}

type ShopCheckoutFormProps =
    ShopCheckoutFormOwnProps
    & ShopCheckoutFormStateToProps
    & ShopCheckoutFormDispatchToProps
    & ReactStripeElements.InjectedStripeProps;

interface FormValues {
    readonly name: string;
    readonly email: string;
}

const getSubmitHandler = (
    stripe: ReactStripeElements.StripeProps,
    skuIds: string[],
    checkoutSubmit: (skuIds: string[], tokenPromise: Promise<ReactStripeElements.PatchedTokenResponse>) => Promise<void>,
) => (values: FormValues) => {
    const tokenPromise = stripe.createToken({ name: values.name });
    checkoutSubmit(skuIds, tokenPromise);
};

const ShopCheckoutForm: React.FC<ShopCheckoutFormProps> = (props) => {
    const { className, cart, stripe, isSubmitting } = props;
    const checkoutSubmit = props.checkoutSubmitAction;
    return (
        <div className={className}>
            <Formik
                initialValues={{ name: '', email: '' }}
                onSubmit={getSubmitHandler(stripe, cart.items.toJS(), checkoutSubmit)}
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

const mapStateToProps = ({ shop }: GlobalStateShape) => ({
    cart: shop.cart,
    isSubmitting: shop.isSubmitting,
    submitSuccess: shop.submitSuccess,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<GlobalStateShape, undefined, Action>): ShopCheckoutFormDispatchToProps => ({
    checkoutSubmitAction: (skuIds: string[], tokenPromise: Promise<ReactStripeElements.PatchedTokenResponse>) => dispatch(checkoutSubmitAction(skuIds, tokenPromise)),
});

const connectedShopCheckoutForm = connect<ShopCheckoutFormStateToProps, ShopCheckoutFormDispatchToProps, {}>(
    mapStateToProps,
    mapDispatchToProps,
)(injectStripe(ShopCheckoutForm));

export default connectedShopCheckoutForm;
