import CardHeader from '@material-ui/core/CardHeader';
import { withStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
  title: {
    color: 'white',
  },
  root: {
    background: theme.palette.primary.main,
  },
  
});
export default withStyles(styles)(CardHeader);
