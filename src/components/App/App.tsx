import * as React from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';

class App extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <Button bsStyle="success">I did a poop</Button>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
