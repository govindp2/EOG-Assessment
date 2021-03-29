import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { Measurement } from '../utilities/interface';

const useStyles = makeStyles({
  chip: {
    minWidth: 250,
    margin: 3,
    fontSize: 15,
  },
});

const MetricCard =(props: { measurement: Measurement }) => {
  
  const classes = useStyles();
  

  return <Chip className={classes.chip} label={`${props.measurement.metric}: ${props.measurement.value}${props.measurementmeasurement.unit}`} />;
}

export default MetricCard;