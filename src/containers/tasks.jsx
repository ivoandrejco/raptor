import { Fragment, useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import { unwrapResult } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import { fetchTasks } from '../redux/slices/tasks'

import { 
  TaskList,
  TaskCreateContainer,
} from '../components/tasks'



export const TasksContainer = () => {
  const dispatch         = useDispatch()
  const [tasks,setTasks] = useState()

  useEffect( () => dispatch(fetchTasks()).then(unwrapResult)
                    .then( data => setTasks(data) )
                    .catch( e => console.error(e) ) 
          , [])

  return (
    <Fragment>

      <Route exact path="/tasks/">
        <TaskList tasks={tasks} showPatient={true} />
      </Route>

    </Fragment>
  )
}

export default TasksContainer