import React, { useState } from 'react'
import { Link, useHistory, useLocation, Redirect } from 'react-router-dom'

import { Nav, Navbar, NavDropdown, Form, FormControl } from 'react-bootstrap'

import { setFilter } from './redux/slices/search'
import { useDispatch } from 'react-redux'

const Navigator = () => {
  const [searchItem,setSearchItem] = useState("")
  const history  = useHistory()
  const dispatch = useDispatch()
  

  
  const handleSubmitSearch = () => {
    const path = history.location.pathname.split("/")
    const href = searchItem ? `/${path[1]}/?search=${searchItem}` : `/${path[1]}/`
    dispatch(setFilter(searchItem))
    history.push(href)
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Navbar.Brand href="/">Raptor</Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
        <NavDropdown title="Templates" id="collasible-nav-dropdown">
          <NavDropdown.Item as={Link} to="/templates/issues/">Issues</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/templates/investigations/">Investigations</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item as={Link} to="/templates/create/">Create Template</NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title="Billings" id="collasible-nav-dropdown">
          <NavDropdown.Item as={Link} to="/billings/claims">Claims</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/billings/claim/create">Create Claim</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/billings/claimspaid">Claims Paid</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/billings/claimpaid/create">Create Claim Paid</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item as={Link} to="/billings/summary">Claims Summary</NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title="Patiens" id="collasible-nav-dropdown">
          <NavDropdown.Item as={Link} to="/patients/">Patients</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/patients/create/">Create Patient</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item as={Link} to="/consultations/">Consultations</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/tasks/">Tasks</NavDropdown.Item>
        </NavDropdown>
      </Nav>
      <Form inline onSubmit={(e) => {e.preventDefault();handleSubmitSearch()}} >
        <FormControl 
          type="text" 
          value={searchItem}
          placeholder="Search" 
          className="mr-sm-2" 
          onChange={ (e) => setSearchItem(e.target.value) }
        />
      </Form>
    </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigator;