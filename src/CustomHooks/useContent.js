import React from 'react';
import EnvironmentSettings from 'Constants/EnvironmentSettings.json';
import englishContent from 'Content/englishContent.json';

const DEV_MODE = EnvironmentSettings.devMode;

export default function useContent() {
    // Can be updated later to support different languages
    // const [contentLanguage, setContentLanguage] = React.useState('EN');


    /* injections is an optional array to fill content keys with variable text
    *   Example, given the following key:
    *   "MONTH_TOTAL": "<<arg0:month_name>> Total"
    *
    *   We can replace '<<arg0:month_name>>' with the first element of the injections array
    *
    *   The number in arg# will match the index in the injections array.
    *   Anything following ':' like ':month_name' is only for developer clarity to know what kind of text is expected.
    *   It is otherwise ignored.
    * */
    return React.useCallback((groupKey, contentKey, injections) => {
        if(!groupKey || !contentKey) {
            return DEV_MODE ? 'MISSING_KEY_ARGS' : '';
        }

        const NOT_FOUND = DEV_MODE ? `MISSING_CONTENT: ${groupKey + ':' + contentKey}` : '';

        if(!englishContent[groupKey]) {
            return NOT_FOUND;
        }

        let desiredText = englishContent[groupKey][contentKey];
        if(!desiredText) {
            return NOT_FOUND;
        }

        injections && injections.forEach((text, index) => {
            const regex = new RegExp(`<<arg${index}:.+?>>`);
            desiredText = desiredText.replace(regex, text);
        });

        return desiredText;
    }, []);
}