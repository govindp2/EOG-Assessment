import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent } from '@material-ui/core';
import { useSubscription } from '@apollo/react-hooks';
import { Measurement, MeasurementSub } from './utilities/interface';
import { dataFilter, dataHandler, dataTransformer, metricData } from './utilities/GraphQLCall';
import Header from './Header/Header';
import GraphView from './Chart'

const useStyles = makeStyles({
  card: {
    margin: '5% 10%',
  },
  taskBar: {
    backgroundColor: 'white',
  },
});



export default () => {
  const classes = useStyles();
  const [metricStrings, setMetricStrings] = useState<string[]>([]);
  const [selection, setSelection] = useState<(string | undefined)[]>([]);
  const [initialData, setInitialData] = useState<Plotly.Data[]>([]);
  const [filteredData, setFilteredData] = useState<Plotly.Data[]>([]);
  const { loading, data } = useSubscription<MeasurementSub>(newMeasurement);
  const [prevSubData, setPrevSubData] = useState<Measurement>({metric: "", at: 0, value: 0, unit: ""});
  const [latestData, setLatestData] = useState<Measurement[]>([])

  useEffect(() => {
    const initialFetch = async () => {
      const metricsRes = await metricData();

      const dataRes = await  dataHandler(metricsRes);

      const transformedData = dataTransformer(dataRes);

      setMetricStrings(metricsRes);

      let initialLatestData: Measurement[] = [] 
      metricsRes.forEach((metric: string)=>{
        initialLatestData.push({metric: metric, at: 0, value: 0, unit: ""})
      })
      setLatestData(initialLatestData);

      setInitialData(transformedData);
    };
    initialFetch();
  }, []);

  useEffect(() => {
    const filteredDataValue = dataFilter(initialData, selection);
    setFilteredData(filteredDataValue);
  }, [initialData, selection]);

  useEffect(()=>{

    if (!loading && (data?.newMeasurement.at !== prevSubData.at || data.newMeasurement.value !== prevSubData.value || data.newMeasurement.metric !== prevSubData.metric)) {
        let measurementNode = data?.newMeasurement
        let matchingSet = initialData.find(metricNode => metricNode.name === measurementNode?.metric);
        if (matchingSet && measurementNode){
          (matchingSet.x as Plotly.Datum[]).push(new Date(measurementNode.at));
          (matchingSet.y as Plotly.Datum[]).push(measurementNode.value);
          const updatedData = initialData.map((metricNode)=>{
            if(metricNode.name === measurementNode?.metric){
              return matchingSet
            } else {
              return metricNode
            }
          });
          setInitialData(updatedData as Plotly.Data[]);
          if (data) {
            let latestDataTemplate = latestData.map(measurement =>{
              return measurement.metric === data.newMeasurement.metric ? data.newMeasurement : measurement
            })
            setLatestData(latestDataTemplate)

            setPrevSubData(data.newMeasurement)
          }
        }
      }
  },[initialData, loading, data, prevSubData, latestData])

  return (
    <Card className={classes.card}>
      <Header metrics={metricStrings} selection={selection} setSelection={setSelection} latestData={latestData}/>
      <CardContent style={{ padding: 0 }}>
        <GraphView data={filteredData} />
      </CardContent>
    </Card>
  );
};
