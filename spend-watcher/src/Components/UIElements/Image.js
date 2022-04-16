import React from 'react';

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const mimeTypeMapper = {
    jpg: 'image/jpeg',
    png: 'image/png'
};

/**
 * ----------- Mandatory Params -----------
 * webpImage - import the webpVersion of your image and pass it to <Image /> under this prop
 * regularImage - import the regular version of your image and pass it to <Image /> under this prop
 * ----------- Optional Params -----------
 * optionalAlt - String: Alt text to display when Image can't load properly
 * classes - String: list of css classes to use on the Image
 */

// Will attempt to render the image as a webp if the browser supports webp type images.  Else it will try the default image
export default function Image({ webpImage,
    regularImage,
    imageBaseType,
    optionalAlt,
    classes = '',
    label,
    onLoad = () => { /* NOOP*/ } }
) {
    const fileType = imageBaseType.toLowerCase();
    const mimeType = mimeTypeMapper[fileType];

    if(!mimeType) {
        return null;
    }

    return (
        <div role='img' aria-label={label}>
            <picture>
                <source type='image/webp'
                        srcSet={webpImage}
                />
                <source type={mimeType}
                        srcSet={regularImage}
                />
                <img src={regularImage}
                     alt={optionalAlt || ''}
                     className={classes}
                     onLoad={onLoad}
                />
            </picture>
        </div>
    );
}