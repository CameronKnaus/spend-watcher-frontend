declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

// Redecalare forwardRef for making generic easier to use
declare module 'react' {
    function forwardRef<T, P = object>(
        render: (props: P, ref: React.Ref<T>) => React.ReactNode | null,
    ): (props: P & React.RefAttributes<T>) => React.ReactNode | null;
}

declare module 'react' {
    import * as ReactTypings from '@types/react';
    export = ReactTypings;

    export function forwardRef<T, P = object>(
        render: (props: P, ref: React.Ref<T>) => React.ReactNode | null,
    ): (props: P & React.RefAttributes<T>) => React.ReactNode | null;
}
