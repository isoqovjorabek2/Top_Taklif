import React from 'react';
import { Deal, UserLocation } from '../types';
import TashkentMap from './TashkentMap';

interface MapProps {
  deals: Deal[];
  userLocation: UserLocation | null;
  onDealSelect: (deal: Deal) => void;
  selectedDeal?: Deal;
}

const Map: React.FC<MapProps> = ({ deals, userLocation, onDealSelect, selectedDeal }) => {
  return (
    <TashkentMap
      deals={deals}
      userLocation={userLocation}
      onDealSelect={onDealSelect}
      selectedDeal={selectedDeal}
      className="w-full h-96"
    />
  );
};

export default Map;