import englishContent from 'Content/english';

// Given English is the default, the type will be based on the English content structure

export type ContentStructure = typeof englishContent;
export type ContentGroupKey = keyof ContentStructure;

export default function useContent<T extends ContentGroupKey>(contentGroup: T) {
    function getContent(key: keyof ContentStructure[T]): string {
        return englishContent[contentGroup][key];
    }

    return getContent;
}
