import { useState, useCallback } from 'react';
import styles from './Trips.module.css';
import useContent from 'CustomHooks/useContent';
import Link from 'Components/UIElements/Navigation/Link/Link';
import TripsList from 'Components/Trips/TripsList/TripsList';
import { CgChevronDown, CgChevronUp } from 'react-icons/cg';
import { MdAddCircleOutline } from 'react-icons/md';
import useTripDetails from 'CustomHooks/useTripDetails';
import TripsSlideInPanel from 'Components/Trips/TripsSlideInPanel/TripsSlideInPanel';

export default function Trips() {
    const [listCollapsed, setListCollapsed] = useState(true);
    const [createNewTrip, setCreateNewTrip] = useState(false);
    // existing trip to view is based on the trips list index
    const [existingTripToView, setExistingTripToView] = useState<number | null>(null);

    const getContent = useContent('TRIPS');

    const { tripDetailsError, tripDetailsLoading, tripsList } = useTripDetails();

    const Container = useCallback(({ children }: any) => {
        return (
            <div className={styles.tripsContainer}>
                <h2 className={`header-text ${styles.title}`}>
                    {getContent('DASHBOARD_TITLE')}
                </h2>
                {children}
            </div>
        );
    }, [getContent]);

    if(tripDetailsError) {
        // TODO: Proper Error Handling
        return (
            <Container>
                <div className={styles.issueMessage}>
                    {getContent('ERROR')}
                </div>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {JSON.stringify(tripDetailsError, null, 2)}
                </pre>
            </Container>
        );
    }

    function handlePanelClose() {
        setExistingTripToView(null);
        setCreateNewTrip(false);
    }

    return (
        <Container>
            <TripsList tripsList={listCollapsed ? tripsList.slice(0, 3) : tripsList}
                       isLoading={tripDetailsLoading}
                       setExistingTripToView={setExistingTripToView}
            />
            <div className={styles.actionsContainer}>
                {
                    tripsList.length > 3 && (
                        <Link CustomIcon={listCollapsed ? CgChevronDown : CgChevronUp}
                              text={getContent(listCollapsed ? 'VIEW_ALL' : 'VIEW_LESS')}
                              customClass={styles.linkContainer}
                              textAlign='center'
                              onClickCallback={() => setListCollapsed(current => !current)}
                        />
                    )
                }
                <Link CustomIcon={MdAddCircleOutline}
                      text={getContent('CREATE_TRIP')}
                      customClass={styles.linkContainer}
                      textAlign='center'
                      onClickCallback={() => setCreateNewTrip(true)}
                />
            </div>
            {
                (existingTripToView != null) && (
                    <TripsSlideInPanel tripToView={tripsList[existingTripToView]}
                                       handlePanelClose={handlePanelClose}
                    />
                )
            }
            {
                createNewTrip && (
                    <TripsSlideInPanel handlePanelClose={handlePanelClose} />
                )
            }
        </Container>
    );
}