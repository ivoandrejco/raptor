import {Row,Col} from 'react-bootstrap'
import {Route,Switch} from 'react-router-dom'

import {
  ClaimsContainer,
  ClaimCreateContainer,
  ClaimsPaidContainer,
  ClaimPaidCreateContainer
} from '../components/billings'

const BillingsContainer = () => {

  return (
    <Row>
      <Col>
        <Switch>
  
          <Route exact path="/billings/claims/">
            <ClaimsContainer />
          </Route>

          <Route exact path="/billings/claim/create/">
            <ClaimCreateContainer />
          </Route>
          
          <Route exact path="/billings/claimspaid/">
            <ClaimsPaidContainer />
          </Route>

          <Route exact path="/billings/claimpaid/create/">
            <ClaimPaidCreateContainer />
          </Route>

        </Switch>
      </Col>
    </Row>
  )
}

export default BillingsContainer