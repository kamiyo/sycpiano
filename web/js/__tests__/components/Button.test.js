import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Button from '@/js/components/_reusable/Button.jsx';

it('renders correctly', () => {
    const tree = renderer.create(
        <Button />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders with extra class', () => {
    const tree = renderer.create(
        <Button
            extraClasses='extra-class'
            onClick={() => {}}
        />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders with onClick', () => {
    const mockOnClick = jest.fn();
    const button = shallow(<Button onClick={mockOnClick} />);
    button.find('.Button').simulate('click');
    expect(mockOnClick.mock.calls.length).toBe(1);
});
