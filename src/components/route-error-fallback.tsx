import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface RouteErrorFallbackProps {
  routeKey: 'newReleases' | 'artists' | 'artistDetails' | 'albumDetails' | 'favorites' | 'trackRegistration' | 'dashboard';
}

export const RouteErrorFallback: React.FC<RouteErrorFallbackProps> = ({ routeKey }) => {
  const { t } = useTranslation();
  return <div className="p-4">{t(`routeErrors.${routeKey}`)}</div>;
};
