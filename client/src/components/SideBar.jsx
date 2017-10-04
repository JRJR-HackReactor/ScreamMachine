import React from 'react';
import Card, {CardContent} from 'material-ui/Card';
import Grid from 'material-ui/Grid';

const SideBar = () => (

    <div>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>This is your Highest Score!!!!!</CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>These are Other Peoples High Scores!!!!</CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>

);

export default SideBar;
