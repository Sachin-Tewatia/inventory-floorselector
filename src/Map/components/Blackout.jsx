import React from 'react';
import { mark_blackout } from '../data/marks';
import { useBlackout } from '../hooks';

const Blackout = React.memo(() => {
  const { blackout } = useBlackout();

  return (
    <g
      className={`transition-opacity duration-300 ${blackout ? 'opacity-100' : 'opacity-0'}`}
      style={{ zIndex: 1 }}
    >
      <g className="overlay-can-hide">
        {mark_blackout}
      </g>
    </g>
  );
});

export default Blackout;