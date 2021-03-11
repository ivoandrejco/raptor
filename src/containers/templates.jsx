import { Fragment, useEffect } from 'react'
import { Route } from 'react-router-dom'

import { 
  TemplateList,
  TemplateCreateContainer,
} from '../components/templates'

import { 
  TemplateIssueCreate, 
  TemplateIssueUpdate, 
  TemplateIssueList,
  TemplateCreate,
} from '../components/templates/issues'

import { 
  TemplateInvestigationCreate,
  TemplateInvestigationUpdate
} from '../components/templates/investigations'


export const TemplatesContainer = () => {

  return (
    <Fragment>
      <Route exact path="/templates/create/">
        <TemplateCreateContainer />
      </Route>

      <Route exact path="/templates/issues/">
        <TemplateIssueList />
      </Route>

      <Route exact path="/templates/">
        <TemplateList />
      </Route>

      <Route exact path="/templates/investigations/">
        <TemplateList />
      </Route>

      <Route exact path="/templates/issues/:id/update/">
        <TemplateIssueUpdate />
      </Route>
      <Route exact path="/templates/investigations/:id/update/">
        <TemplateInvestigationUpdate />
      </Route>
    </Fragment>
  )
}

export default TemplatesContainer