import React, {useState} from 'react'
import {Route, Link} from 'react-router-dom'
import {Form,Row,Col, Button} from 'react-bootstrap'
import {useFormik} from 'formik'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const TemplatesPage = (props) => {

  return (
    <React.Fragment>
    <Route exact path="/templates/create">
      <TemplateCreate />
    </Route>
    <Route exact path="/templates">
      <h3>Templates</h3>
    </Route>
    

    </React.Fragment>
  )
}

export default TemplatesPage

const tNeutropenia = {
  name: 'Neutropenia',
  systems: [
    {
      name: "Constitutional symptoms",
      symptoms: [
        {
          id: "fatigue",
          name: "Fatigue",
          tip: "",
          value: null,
          comment: ""
        },
        {
          id: "weight_loss",
          name: "Weight loss",
          tip: "how much over how long",
          value: null,
          comment: ""
        }
      ]
    },
    {
      name: "Rheumatological symptoms",
      symptoms: [
        {
          id: "skin_rash",
          name: "Skin rash",
          tip: "photosensitivity, distribution",
          value: null,
          comment: ""
        },
        {
          id: "joint_swelling",
          name: "Joint issues",
          tip: "photosensitivity, distribution",
          value: null,
          comment: ""
        }
      ]
    }
  ] 
}


export const TemplateIssue = ({name, formik}) => {
  
  const template = tNeutropenia
  if(formik && !formik.values["template"])
    formik.values["template"] = tNeutropenia

  const handleChange = e => {
    console.log(`TemplateInser(name): ${e.target.id} ${e.target.name} - ${e.target.value}`)
    template.systems.map( s => {
      s.symptoms.map( sx => {
        if(sx.id === e.target.id) {
          if(!/.*_comment/.exec(sx.name)) {
            console.log(`${sx.name}.value: ${e.target.value}`)
            sx.value = e.target.value === "Yes" ? true : false
          }
          else {
            sx.comment = e.target.value
          }
        } 
        return sx
      })
    })
    formik.handleChange(e)
  }

  return (
    <React.Fragment>
      { template && template.systems.map( (s,i) => {

        return (
          <React.Fragment key={i}>
            <h5>{s.name}</h5>
            {s.symptoms.map( (sx,j) => {
              return (
                <Form.Group key={j}>
                <Form.Row>
                <Col lg={3}  style={{paddingTop: "5px"}}>
                  {sx.name}
                </Col>
                <Col lg={1}>  
                  <Form.Check
                    id={sx.id}
                    name={sx.id}
                    type="radio"
                    value="Yes"
                    label="Yes"
                    style={{paddingTop: "5px"}}
                    onChange={handleChange}
                  />
                  </Col>
                  <Col lg={1}>
                  <Form.Check
                  id={sx.id}
                  name={sx.id}
                  type="radio"
                  value="No"
                  label="No"
                  style={{paddingTop: "5px"}}
                  onChange={handleChange}
                  />
                  </Col>

                  <Col>
                  <Form.Control
                  id={`${sx.id}`}
                  name={`${sx.id}_comment`}
                  type="text"
                  value={formik.values[`${sx.id}_comment`]?formik.values[`${sx.id}_comment`]:""}
                  onChange={ handleChange }
                  placeholder={sx.tip}
                  />
                  </Col>
                </Form.Row>
                
                </Form.Group>
              )
            })}
  
          </React.Fragment>
        )
      })}
    </React.Fragment>
  )
}
  


export const TemplateInsert = ({name, formik}) => {
  const template = tNeutropenia
  if(!formik.values["template"])
    formik.values["template"] = tNeutropenia

  const handleChange = e => {
    console.log(`TemplateInser(name): ${e.target.id} ${e.target.name} - ${e.target.value}`)
    template.systems.map( s => {
      s.symptoms.map( sx => {
        if(sx.id === e.target.id) {
          if(!/.*_comment/.exec(sx.name)) {
            console.log(`${sx.name}.value: ${e.target.value}`)
            sx.value = e.target.value === "Yes" ? true : false
          }
          else {
            sx.comment = e.target.value
          }
        } 
        return sx
      })
    })
    formik.handleChange(e)
  }

  return (
    <React.Fragment>
      { template.systems.map( (s,i) => {

        return (
          <React.Fragment key={i}>
            <h5>{s.name}</h5>
            {s.symptoms.map( (sx,j) => {
              return (
                <Form.Group key={j}>
                <Form.Row>
                <Col lg={3}>
                  {sx.name}
                </Col>
                <Col lg={1}>  
                  <Form.Check
                    id={sx.id}
                    name={sx.id}
                    type="radio"
                    value="Yes"
                    label="Yes"
                    onChange={handleChange}
                  />
                  </Col>
                  <Col lg={1}>
                  <Form.Check
                  id={sx.id}
                  name={sx.id}
                  type="radio"
                  value="No"
                  label="No"
                  onChange={handleChange}
                  />
                  </Col>
                  </Form.Row>
                  <Form.Row>
                  <Col>
                  <Form.Control
                  id={`${sx.id}`}
                  name={`${sx.id}_comment`}
                  type="text"
                  value={formik.values[`${sx.id}_comment`]?formik.values[`${sx.id}_comment`]:""}
                  onChange={ handleChange }
                  placeholder={sx.tip}
                  />
                  </Col>
                </Form.Row>
                
                </Form.Group>
              )
            })}
  
          </React.Fragment>
        )
      })}
    </React.Fragment>
  )
}
           
export const TemplateCreate = (props) => {
  const [name,setName] = useState("")
  const [categoryName,setCategoryName] = useState("") 
  const [categories, setCategories] = useState([])
  const [symptomName, setSymptomName] = useState("")
  const [symptomTip, setSymptomTip] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(0)
  
  const deleteSx = (cat,sx) => {
    
    const new_categories = categories.filter( c => {
      
      if(c.name === cat) 
        c.symptoms = c.symptoms.filter( s => s.name !== sx )
      return c 
    })
    setCategories(new_categories)
  }

  const deleteCat = (catName) => {
    const new_categories = categories.filter( c => c.name !== catName )
    setCategories(new_categories)
  }
  return (
    <React.Fragment>
      <Row>
        <Col><h2>New Template</h2></Col>
        <Col><h2>Template Preview</h2></Col>
      </Row>
      <Row>
        <Col>

          <Form key={5} onSubmit={e => e.preventDefault()}>
            <Form.Group>
            <Form.Control
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={ e=> setName(e.target.value) }
            placeholder="Name"
            />
            </Form.Group>
          </Form>
          <h4>Symptoms Categories</h4>
          <Form key={10} >
            <Form.Group>
              <Form.Control as="select" onChange={ e => {setSelectedCategory(e.target.value); }}>
                <option>Select Category ({categories.length})</option>
                
                {categories.map( (v, k) => {
                  return (<option key={k}>{v.name}</option>)
                })}
              </Form.Control>
            </Form.Group>
          </Form>
          <Form key={20} onSubmit={ 
              e => {
                e.preventDefault(); 
          
                let found = null
                const category = {
                  id: categoryName.trim().toLowerCase().replaceAll(" ","_"),
                  name: categoryName, 
                  symptoms: []
                }
                found = categories.find( (v,i) => {
                  if(v.id === category.id)
                    return true

                })
                if(!found) {
                  categories.push(category)
                  setCategories(categories); 
                }
                setCategoryName("") 
              }} >
            <Form.Group>
              <Form.Control
                type="text"
                name="category_name"
                placeholder="Type a category name and press [Enter]"
                onChange={e => setCategoryName(e.target.value)}
                value={categoryName}
                />
            </Form.Group>
          </Form>
          <h4>Symptoms</h4>
          <Form onSubmit={ e => {e.preventDefault();
            
            categories.filter( cat => {
              
              if(cat.name === selectedCategory) {
                cat.symptoms.push({name:symptomName, tip:symptomTip})
                setSymptomName("")
                return cat
              }
            })
            setCategories(categories)
          }}>
            <Form.Group key={1}>
              <Form.Control
                type="text"
                name="symptom_name"
                placeholder="Type a name of symptom and press [Enter]"
                onChange={e => {setSymptomName(e.target.value); console.log(`symptom_name: ${symptomName}`)}}
                value={symptomName}
                />
            </Form.Group>
            <Form.Group key={2}>
              <Form.Control
                type="text"
                name="symptom_tip"
                placeholder="Type in tips for the symptom description and press [Enter]"
                onChange={e => setSymptomTip(e.target.value)}
                value={symptomTip}
                />
            </Form.Group>
            <Button type="submit">Add</Button>
          </Form>

        </Col>
        <Col>
          <h4>Name</h4>
          <p>{name}</p>
          <h4>Symptoms by Category</h4>
          <ul className="list-unstyled">
          {categories.map( (v, k) => {
            console.log(JSON.stringify(v))
            let cat = <li key={k} ><a href="#" onClick={() => deleteCat(v.name)}><FontAwesomeIcon icon={faTrash} color="red"/></a>&nbsp;<strong>{v.name}</strong></li>
            let sx  = v.symptoms.map( (s,i) => (<li key={i}><a href="#" onClick={() => deleteSx(v.name,s.name)}><FontAwesomeIcon icon={faTrash} color="red"/></a>&nbsp;{s.name}{s.tip?` - ${s.tip}`:null}</li>))
            return <React.Fragment>{cat}<ul className="">{sx}</ul></React.Fragment>
            
          })}
          </ul>     
        </Col>
        
      </Row>
    </React.Fragment>
  )
}