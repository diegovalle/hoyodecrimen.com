import React, {useState, useEffect} from 'react';
import {groupBy, map, reduce, sortBy, filter, max, maxBy} from 'lodash-es';
//import {FormattedDate} from 'react-intl';
//import {useIntl, injectIntl, FormattedMessage} from 'react-intl';
import LineChart from '../components/LineChart';
import {timeFormatDefaultLocale, timeFormatLocale} from 'd3-time-format';
//import {dateLoc} from '../../src/i18n';
//import '../assets/css/trends.css';

function SmallMulLineChart (props) {
  const [data, setData] = useState (null);
  const [month, setMonth] = useState (null);

  useEffect (() => {
    fetch ('https://trends.elcri.men/states_trends.json')
      .then (response => response.json ())
      .then (responseJSON => {
        setData (responseJSON);
      })
      .catch (error => {
        console.error (error);
      });
  }, []);

  const maxRate = data => {
    if (!data || data.length == 0) return null;
    let max_rate = maxBy (data, function (o) {
      return max (o[Object.keys (o)[0]][3]);
    });
    return max (max_rate[Object.keys (max_rate)[0]][3]);
  };

  const formatData = data => {
	const start_year = 2017
    let state = Object.keys (data)[0];
    let len = data[state][0].length;
    // Substract one from the length of the array since js months are zero indexed
    setMonth ((len-1) % 12);
    let state_tidy = [[], []];
    for (let i = 0; i < len; i++) {
      let d = new Date (start_year, 0, 1);
      state_tidy[0].push ({
        value: data[state][1][i],
        date: new Date (d.setMonth (d.getMonth () + i)),
        l: data[state][0][i],
        u: data[state][2][i],
        active: true,
      });
      state_tidy[1].push ({
        value: data[state][3][i],
        date: new Date (d.setMonth (d.getMonth ())),
        active: true,
      });
    }
    //for (var i = 0; i < state_tidy.length; i++) {
    //    state_tidy[i] = MG_convert_date(state_tidy[i], "date");
    // }
    return state_tidy;
  };

  const intl = useIntl ();
  let l;
  intl.locale === 'es' ? (l = timeFormatDefaultLocale (dateLoc.es_MX)) : null;

  let pos = filter (data, function (o) {
    return o.trend[0] === 'positive';
  });
  let max_pos = maxRate (pos);

  let neg = filter (data, function (o) {
    return o.trend[0] === 'negative';
  });
  let max_neg = maxRate (neg);

  let na = filter (data, function (o) {
    return o.trend[0] === null;
  });
  let max_na = maxRate (na);

  return (
    <div id="up-down">


      {neg ? console.time ('answer time') : null}
      <div className="grid-wrapper" id="small-multiples">
        <div className="columns is-multiline" id="small-multiples">
          {data ? (pos.length
            ? pos.map ((state, i) => (
                <div className="column is-4" key={i}>
                  <figure className="image is-4by3" key={i}>
                    <div className=" has-ratio" key={i}>
                      <LineChart
                        data={state}
                        key={i}
                        formatData={formatData}
                        max_y={max_pos}
                      />
                    </div>
                  </figure>
                </div>
              ))
            : <p>{intl.formatMessage ({id: 'None'})} 😃</p>) : null}
        </div>
      </div>

     

      <div className="grid-wrapper" id="small-multiples">
        <div className="columns is-multiline" id="small-multiples">

          {data ? (neg.length
            ? neg.map ((state, i) => (
                <div className="column is-4" key={i}>
                  <figure className="image is-4by3" key={i}>
                    <div className=" has-ratio" key={i}>
                      <LineChart
                        data={state}
                        key={i}
                        formatData={formatData}
                        max_y={max_neg}
                      />
                    </div>
                  </figure>
                </div>
              ))
            : <p>{intl.formatMessage ({id: 'None'})} 😡</p>) : null}
        </div>
      </div>
      {neg ? console.timeEnd ('answer time') : null}
     

    </div>
  );
}

export default SmallMulLineChart;
