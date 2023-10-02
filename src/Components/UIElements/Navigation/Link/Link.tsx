import { Link as ReactRouterLink } from 'react-router-dom';
import { CgChevronRight, CgChevronLeft } from 'react-icons/cg';
import { EmptyCallback } from 'Types/QoLTypes';
import { JustifyContent } from 'Types/StyleTypes';
import { IconType } from 'react-icons';

// This component was a mistake

type LinkAlignment = 'center' | 'left' | 'right';

const alignmentMapper: Record<LinkAlignment, JustifyContent> = {
    center: 'center',
    left: 'flex-start',
    right: 'flex-end'
};


// Currently, this link will only support internal routing.
// It can easily be converted to external routing but there isn't a use-case yet
type LinkPropTypes = {
    text: string,
    route?: string,
    useChevron?: boolean,
    useChevronLeft?: boolean,
    customClass: string,
    textAlign?: LinkAlignment,
    CustomIcon?: IconType,
    onClickCallback: EmptyCallback
}

export default function Link({ text, route, useChevron, useChevronLeft, customClass, textAlign, CustomIcon, onClickCallback }: LinkPropTypes) {
    const textAlignment = textAlign ? alignmentMapper[textAlign] : 'flex-start';

    let icon = null;
    if(useChevron) {
        icon = <CgChevronRight />;
    } else if(CustomIcon) {
        icon = <CustomIcon />;
    }

    const linkStyle = {
        color: 'var(--theme-link-blue)',
        textDecoration: icon ? 'none' : 'underline',
        display: 'flex',
        alignItems: 'center',
        justifyContent: textAlignment
    };

    // An internal route was specified so wrap the link in router
    if(route) {
        return (
            <ReactRouterLink to={route} style={{ textDecoration: 'none' }}>
                <span className={customClass}
                      style={linkStyle}
                      onClick={onClickCallback}
                >
                    {useChevronLeft && <CgChevronLeft />}
                    {text}
                    {!useChevronLeft && icon}
                </span>
            </ReactRouterLink>
        );
    }

    // Basic non-routing callback-only link
    return (
        <button style={linkStyle}
                className={customClass}
                onClick={onClickCallback}
        >
            {useChevronLeft && <CgChevronLeft />}
            <span style={useChevronLeft ? { paddingLeft: 4 } : { paddingRight: 4 }}>
                {text}
            </span>
            {!useChevronLeft && icon}
        </button>
    );
}