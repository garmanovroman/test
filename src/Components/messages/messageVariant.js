import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import defaultImg from '../../images/fake.png';

export default function MessageVariant(props) {
  const verst = (mes) => {
    let from = props.variants.findIndex((item) => {
      return item.calculationGuid == mes.guidCalculationFrom;
    });
    let to = props.variants.findIndex((item) => {
      return item.calculationGuid == mes.guidCalculation;
    });

    if (from < to) {
      return `<div class="mes-variant--num-left">V${
        from + 1
      }</div><div class="mes-variant--icon" style=background-image:url("https://storage.yandexcloud.net/system123.render.lab/calculationResults/${
        props.mes.guidCalculationFrom
      }/main_icon.jpg")></div><div class="mes-variant--arrow mes-variant--arrow--right"></div><div class="mes-variant--num-right">V${
        to + 1
      }</div><div
      class="mes-variant--icon mes-variant--icon--right 2"
      style=background-image:url("https://storage.yandexcloud.net/system123.render.lab/calculationResults/${
        props.mes.guidCalculation
      }/main_icon.jpg")></div>`;
    } else {
      return `<div class="mes-variant--num-left">V${
        to + 1
      }</div><div class="mes-variant--icon 3" style=background-image:url("https://storage.yandexcloud.net/system123.render.lab/calculationResults/${
        props.mes.guidCalculation
      }/main_icon.jpg")></div><div class="mes-variant--arrow mes-variant--arrow--left"></div><div class="mes-variant--num-right">V${
        from + 1
      }</div><div class="mes-variant--icon 4 mes-variant--icon--right" style=background-image:url("https://storage.yandexcloud.net/system123.render.lab/calculationResults/${
        props.mes.guidCalculationFrom
      }/main_icon.jpg")
      ></div>`;
    }
  };

  return <div className="mes-variant" dangerouslySetInnerHTML={{ __html: verst(props.mes) }}></div>;
}
