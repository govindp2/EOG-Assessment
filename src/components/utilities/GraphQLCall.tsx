import { gql } from '@apollo/client';
import { apiCall } from '../../Utility/GraphAPI'
import { MetricNode } from './interface';


const reloadTime = new Date(Date.now() - 30 * 60000).getTime();
const getMetricQuery = `
query{
    getMetrics
}
`;
const getInputValueQuery = (metrics: string[]) => {
    return metrics.map(metric => {
        return `{metricName: '${metric}', after: ${reloadTime} }`;
    });
};

const getDataValueQuery = (inputQuery: string[]) => {
    return `
    query {
        getMultipleMeasurements(input: [${inputQuery}]){
          metric,
          measurements {
            metric,
            at,
            value,
            unit
          }
        }
      }
    `;
};

export const newMeasurmentsSub = gql`
subscription {
    newMeasurment{
        metric
        at
        value
        unit
    }
}
`;

export const metricData = async () => {
    const resData = await apiCall.query({
   query: gql`
   ${getMetricQuery}
   `,
    });
    return resData.data.getMetrics;
};

export const dataHandler = async (metrics: string[]) =>{
    const resData = await apiCall.query({
        query: gql`
        ${getDataValueQuery(getInputValueQuery(metrics))}
        `,
    });

    return resData.data.getMultipleMeasurments;
};

export const dataFilter = (data: Plotly.Data[], selection: (string | undefined)[]) => {
    let returnArr = data.filter(metricObj => {
      return selection.includes(metricObj.name);
    });
  
    const dummyObj: Plotly.Data = {
      x: [],
      y: [],
      name: '',
      yaxis: 'y',
      type: 'scatter',
      line: { color: '#444' },
    };
  
    returnArr.push(dummyObj);
  
    return returnArr;
  };

  export const dataTransformer = (data: MetricNode[]) => {
    const returnArr: Plotly.Data[] = [];
    const colorArr: string[] = ['#a83a32', '#2d8fa1', '#5ba12d', '#9c2894', '#e6ad8e', '#32403f'];
    data.forEach(metricNode => {
      let metricObj: Plotly.Data = {
        x: [],
        y: [],
        name: '',
        yaxis: '',
        type: 'scatter',
        line: { color: colorArr[data.indexOf(metricNode)] },
      };
      metricNode.measurment.forEach((measurement: { at: string | number | Date; value: any; }) => {
        (metricObj.x as Plotly.Datum[]).push(new Date(measurement.at));
        (metricObj.y as Plotly.Datum[]).push(measurement.value);
      });
      metricObj.name = metricNode.metric;
      switch (metricNode.measurment[0].unit) {
        case 'F':
          metricObj.yaxis = 'y';
          break;
        case 'PSI':
          metricObj.yaxis = 'y2';
          break;
        case '%':
          metricObj.yaxis = 'y3';
      }
      returnArr.push(metricObj);
    }); 
    return returnArr;
  };
  