import {Button, Modal} from "react-bootstrap";
import React, {useState} from "react";

type propsPopup = {
    buttonName: string
    title: string
    children?: any
    showFooter?: boolean
}
const Popup: (props: propsPopup) => JSX.Element = (props: propsPopup) => {
    const {title, buttonName, children, showFooter} = {...props}
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                {buttonName}
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className={'p-2'}>
                    {children}
                </Modal.Body>
                {showFooter ??
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                }
            </Modal>
        </>
    );
}

export {Popup}