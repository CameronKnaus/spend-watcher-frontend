import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { CgChevronRight } from 'react-icons/cg';

const alignmentMapper = {
    center: 'center',
    left: 'flex-start',
    right: 'flex-end'
};

// Currently, this link will only support internal routing.
// It can easily be converted to external routing but there isn't a use-case yet
export default function Link({ text, route, useChevron, customClass, textAlign }) {

    const textAlignment = alignmentMapper[textAlign] || 'flex-start';

    return (
        <ReactRouterLink to={route} style={{ textDecoration: 'none' }}>
            <span className={customClass}
                  style={{
                      color: 'var(--theme-link-blue)',
                      textDecoration: useChevron ? 'none' : 'underline',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: textAlignment
                  }}
            >
                {text}
                <CgChevronRight />
            </span>
        </ReactRouterLink>
    );
}