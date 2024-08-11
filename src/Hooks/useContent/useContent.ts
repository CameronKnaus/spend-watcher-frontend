import englishContent from 'Content/english';

// Given English is the default, the type will be based on the English content structure
export type ContentStructure = typeof englishContent;
type ContentGroupKey = keyof ContentStructure;

export default function useContent<T extends ContentGroupKey>(contentGroup: T) {
    return function getContent<K extends keyof ContentStructure[T]>(key: K): ContentStructure[T][K] {
        return englishContent[contentGroup][key];
    };
}
