import React from 'react';
import { CardContent, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MetricCard from '../MetricCard/metricCard';
import SelectBox from '../CheckBox'
import { Measurement } from '../utilities/interface';

const useStyles = makeStyles({
    navBar: {
        background:'white',
    }
})

interface HeaderProps {
    metrics: string[];
  selection: (string | undefined)[];
  setSelection: Function;
  latestData: Measurement[];
}

const Header = (props: HeaderProps) =>{

    const Classes = useStyles();

    return(
        <CardContent className = {Classes.navBar}>
            <Grid container spacing={4} justify='space-evenly'>
                <Grid item xs ={12} sm={6}>
                    {props.latestData.map( valueData => {
                        return props.selection.includes(valueData.metric) ? (
                            <MetricCard key={`${valueData.metric}: ${valueData.value}`} measurement={valueData} />
                        ): null;
                    } )}
                </Grid>
                <Grid item xs={12} sm={6}>
                <SelectBox metrics={props.metrics} selection={props.selection} setSelection={props.setSelection} />
                </Grid>
            </Grid>
        </CardContent>
    )
}

export default Header;

