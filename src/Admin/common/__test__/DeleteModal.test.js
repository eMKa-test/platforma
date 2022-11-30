import React from "react";
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import DeleteModal from '../DeleteModal';

describe( 'DeleteModal', () => {

    const wrapper = shallow(<DeleteModal />);
    const props={
        title: 'delete',
        isOpen: true,
        toggleModal: () => {},
        submit: () => {},
    };
    test( 'DeleteModal test', () => {
        expect(shallow(
            <DeleteModal {...props}/>
        ).length).toEqual(1);
    })
})

