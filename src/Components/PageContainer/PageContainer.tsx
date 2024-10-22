import styles from './PageContainer.module.css';

type PageContainerPropTypes = {
    pageTitle: string;
    children: React.ReactNode;
};

export default function PageContainer({ pageTitle, children }: PageContainerPropTypes) {
    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>{pageTitle}</h1>
            {children}
        </div>
    );
}
