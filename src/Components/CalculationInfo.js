import React, { useState, useEffect } from 'react';
import Network from './Requests';

export default function CalculationInfo(props) {
  const [info, setInfo] = React.useState([]);

  // const send = new Network().GetOutputs(props.variant).then((result) => {
  //     if (result.data != 'false') {
  //         setInfo(result);
  //     }
  // });

  return (
    <div className="infoList">
      <div className="infoList--title">Информация о расчёте</div>
      {info.length > 0 ? (
        info.map((i) => {
          return (
            <div className="infoList--item">
              {i.name} : {i.hint}
            </div>
          );
        })
      ) : (
        <p>Информация о расчёте отсутствует.</p>
      )}
    </div>
  );
}
