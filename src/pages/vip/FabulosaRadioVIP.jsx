import React from 'react';
// Importamos el órgano reutilizable que acabamos de crear
import FabulosaVipPlayer from '../../components/FabulosaVipPlayer';

const FabulosaRadioVIPStandalone = () => {
  return (
    // Le decimos que cuando den "atrás" vuelva a /premium (como siempre)
    <FabulosaVipPlayer backLink="/premium" />
  );
};

export default FabulosaRadioVIPStandalone;