import { useIsMobile } from 'Util/IsMobileContext';
import DesktopNavigation from './DesktopNavigation/DesktopNavigation';
import MobileNavigation from './MobileNavigation/MobileNavigation';

export default function Navigation() {
    const isMobile = useIsMobile();

    if (isMobile) {
        return <MobileNavigation />;
    }

    return <DesktopNavigation />;
}
