const patients = [
  {
    id:"1",
    fname: "Ivo",
    lname: "Andrejco",
    gender: "Male",
    dob: "10/08/1974"
  },
  {
    id: "2",
    fname: "Martina",
    lname: "Andrejco",
    gender: "Female",
    dob: "22/10/1972"
  }
]

const medications = [
  {
    id: '1',
    patient_id: '1',
    name: 'ROsuvastastin',
    dose: '10 mg',
    frequency: 'nocte',
    comment: ''
  },
  {
    id: '2',
    patient_id: '1',
    name: 'Ramipril',
    dose: '10 mg',
    frequency: 'nocte',
    comment: ''
  }
]
const getPatients = () => {
   return new Promise((resolve,reject) => {
    setTimeout(resolve(patients), 1000)
   }) 
}

export function getMedications() {
  return new Promise((resolve,reject) => {
   setTimeout(resolve(medications), 1000)
  }) 
}

export default getPatients;
