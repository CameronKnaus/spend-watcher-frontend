import EnvironmentSettings from 'Constants/EnvironmentSettings.json';
import englishContent from 'Content/englishContent.json';
import { useCallback } from 'react';

export type GroupKeyAccessor = keyof typeof englishContent;
export type ContentKeyAccessor<T extends GroupKeyAccessor> = keyof typeof englishContent[T]


const DEV_MODE = EnvironmentSettings.devMode;

// If a default Group key is given, then the consumer needs only to provide the content key or injections
export default function useContent<T extends GroupKeyAccessor>(groupKey: T) {
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
    function getContent<K extends ContentKeyAccessor<T>>(contentKey: K, injections?: Array<string | number>): string {
        if(!contentKey) {
            return DEV_MODE ? 'MISSING_KEY_ARGS' : '';
        }

        const NOT_FOUND = DEV_MODE ? `MISSING_CONTENT: ${groupKey} : ${String(contentKey)}` : '';

        if(!englishContent[groupKey]) {
            return NOT_FOUND;
        }

        let desiredText = englishContent[groupKey][contentKey] as string;
        if(!desiredText) {
            return NOT_FOUND;
        }

        if(injections) {
            injections.forEach((injectionVar, index) => {
                const regex = new RegExp(`<<arg${index}:.+?>>`);

                const text = typeof injectionVar === 'string' ? injectionVar : String(injectionVar);
                desiredText = desiredText.replace(regex, text);
            });
        }

        return desiredText;
    }

    return useCallback(getContent, [groupKey]);
}