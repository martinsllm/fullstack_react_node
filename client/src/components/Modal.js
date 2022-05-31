import React from "react";
import { Modal } from 'reactstrap';

const ModalExample = ({children, isOpen, toggle}) => {
    return(
        <Modal isOpen={isOpen} toggle={toggle}>
            {children}
        </Modal>
    );
}

export default ModalExample;