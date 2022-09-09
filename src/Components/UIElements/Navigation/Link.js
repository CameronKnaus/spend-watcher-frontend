import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { CgChevronRight, CgChevronLeft } from 'react-icons/cg';

const alignmentMapper = {
    center: 'center',
    left: 'flex-start',
    right: 'flex-end'
};

// This component was a mistake

// Currently, this link will only support internal routing.
// It can easily be converted to external routing but there isn't a use-case yet
export default function Link({ text, route, useChevron, useChevronLeft, customClass, textAlign, CustomIcon, onClickCallback }) {
    const textAlignment = alignmentMapper[textAlign] || 'flex-start';

    function getIcon() {
        if(useChevron) {
            return <CgChevronRight />;
        }

        if(CustomIcon) {
            return <CustomIcon />;
        }

        return null;
    }

    const hasChevron = useChevron || useChevronLeft;

    // An internal route was specified so wrap the link in router
    if(route) {
        return (
            <ReactRouterLink to={route} style={{ textDecoration: 'none' }}>
                <span className={customClass}
                      style={{
                          color: 'var(--theme-link-blue)',
                          textDecoration: hasChevron ? 'none' : 'underline',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: textAlignment
                      }}
                      onClick={onClickCallback}
                >
                    {useChevronLeft && <CgChevronLeft />}
                    {text}
                    {!useChevronLeft && getIcon()}
                </span>
            </ReactRouterLink>
        );
    }

    // Basic non-routing callback-only link
    return (
        <button style={{
                        color: 'var(--theme-link-blue)',
                        textDecoration: hasChevron ? 'none' : 'underline',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: textAlignment
                    }}
                className={customClass}
                onClick={onClickCallback}
        >
            {useChevronLeft && <CgChevronLeft />}
            <span style={useChevronLeft ? { paddingLeft: 4 } : { paddingRight: 4 }}>
                {text}
            </span>
            {!useChevronLeft && getIcon()}
        </button>
    );
}