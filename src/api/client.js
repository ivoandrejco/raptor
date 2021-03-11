import axios from 'axios'
import qs from 'qs'

export const restAPI = (href) => {
  const client = axios.create({
    auth: {
      username: "ivo",
      password: "Sophie20_*08?"
    },
    baseURL: href
  })
  
  return {

    fetchAll:         (arg) => client.get(arg && arg),
    fetchByPatientId: (id) => client.get(`?pid=${id}`),
    fetch:            id => client.get(`${id}/`),
    create:           p => client.post(null,qs.stringify(p)), 
    update:           p => client.patch(`${p.id}/`,qs.stringify(p)),
    delete:           id => client.delete(`${id}/`), 
  }
}


export const API = (href) => {
  const client = axios.create({
    auth: {
      username: "ivo",
      password: "Sophie20_*08?"
    },
    baseURL: href
  })
  
  return {

    fetchAll:         () => client.get(),
    fetchByPatientId: (id) => client.get(`?pid=${id}`),
    fetch:            id => client.get(`${id}/`),
    create:           p => client.post(null,p), 
    update:           p => client.patch(`${p.id}/`,p),
    delete:           id => client.delete(`${id}/`), 
  }
}


export const socialHxAPI = (href) => {
  const client = axios.create({
    auth: {
      username: "ivo",
      password: "Sophie20_*08?"
    },
    baseURL: href
  })
  
  return {

    fetchAll:         () => client.get(),
    fetchByPatientId: (id) => client.get(`?pid=${id}`),
    fetch:            id => client.get(`${id}/`),
    create:           p => client.post(null,qs.stringify(p)), 
    update:           p => client.patch(`${p.pid}/`,qs.stringify(p)),
    delete:           id => client.delete(`${id}/`), 
  }
}

export const templateAPI = (href) => {
  const client = axios.create({
    auth: {
      username: "ivo",
      password: "Sophie20_*08?"
    },
    baseURL: href
  })
  
  return {

    fetchAll:             () => client.get(),
    fetchTemplateByName:  (name,kind=null) => client.get(`?title=${name}&kind=${kind}`),
    fetch:                id => client.get(`${id}/`),
    create:               p => client.post(null,p), 
    update:               p => client.patch(`${p.id}/`,p),
    delete:               id => client.delete(`${id}/`), 
  }
}

export const issueAPI = (href) => {
  const client = axios.create({
    auth: {
      username: "ivo",
      password: "Sophie20_*08?"
    },
    baseURL: href
  })
  
  return {
    fetchByConsultationId:  (id) => client.get(`?cid=${id}`),
    fetchByIssueID:         (id) => client.get(`?iid=${id}`),
    fetchAll:               () => client.get(),
    fetch:                  id => client.get(`${id}/`),
    create:                 p => client.post(null,p), 
    update:                 p => client.patch(`${p.id}/`,p),
    delete:                 id => client.delete(`${id}/`), 
  }
}

export const letterAPI = (href) => {
  const client = axios.create({
    auth: {
      username: "ivo",
      password: "Sophie20_*08?"
    },
    baseURL: href
  })
  
  return {
    fetchByConsultationId:  (id) => client.get(`?cid=${id}`),
    fetchAll:               () => client.get(),
    fetch:                  id => client.get(`${id}/`),
    create:                 p => client.post(null,p), 
    update:                 p => client.patch(`${p.id}/`,p),
    delete:                 id => client.delete(`${id}/`), 
  }
}

export const patientAPI = {
  client: axios.create({
    //baseURL: "http://localhost:3001/patients/"
    auth: {
      username: "ivo",
      password: "Sophie20_*08?"
    },
    baseURL: "http://192.168.1.122:8080/patients/"
  }),
  fetchAll: arg => patientAPI.client.get(arg),
  fetch:    id => patientAPI.client.get(id),
  create:    p => patientAPI.client.post(null,p),
  update:    p => patientAPI.client.patch(p.id,p),
  delete:   id => patientAPI.client.delete(id)
}

export const clientAPI = (href) => {
  const client = axios.create({
    baseURL: `http://localhost:3001/${href}/`
  })
  
  return {

    fetchAll: () => client.get(),
    fetch:    id => client.get(id),
    create:    p => client.post(null,p),
    update:    p => client.patch(p.id,p),
    delete:   id => client.delete(id)
  }
}

export const consultationAPI = {
  client: axios.create({
    baseURL: "http://localhost:3001/consultations/"
  }),
  fetchAll: () => consultationAPI.client.get(),
  create:    p => consultationAPI.client.post(null,p),
  update:    p => consultationAPI.client.patch(p.id,p),
  delete:   id => consultationAPI.client.delete(id)
}