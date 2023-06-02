import React from "react";
import {library} from '@fortawesome/fontawesome-svg-core';
import {faAngleRight, faChevronRight, fas, faSearch} from '@fortawesome/free-solid-svg-icons';
import {faCheckSquare, faSquareMinus} from '@fortawesome/free-regular-svg-icons';

library.add( fas, faCheckSquare, faChevronRight, faSquareMinus, faAngleRight, faSearch)

type propsProductShipping = {
}
const ProductDescriptionBlock: (props: propsProductShipping) => JSX.Element = (props: propsProductShipping) => {

    return (
        <div className="card card-flush mt-5">

        </div>

    )
}

export {ProductDescriptionBlock}
