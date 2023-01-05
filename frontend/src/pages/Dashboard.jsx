import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getGoals, reset } from '../features/goals/goalSlice'
import GoalForm from '../components/GoalForm'
import GoalItem from '../components/GoalItem'
import Spinner from '../components/Spinner'


function Dashboard () {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { goals, isLoading, isError, message } = useSelector((state) => state.goals)

  useEffect(() => {
    if(isError) {
      console.log(message);
    }

    // Navigate to the login page is not logged in
    if (!user) {
      navigate('/login')
    } else {
      dispatch(getGoals())
    }
  
  }, [user, navigate, isError, message, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(reset())
    }
  },[dispatch]);

  if(isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section className='heading'>
        <h1>Welcome, {user && user.name}.</h1>
        <p>Your Dashboard:</p>
      </section>

      <GoalForm />

      <section className='content'>
        {goals.length > 0 ? (
          <div className='goals'>
            {goals.map((goal) => (
              <GoalItem key={goal._id} goal={goal} />
            ))}
          </div>
        ) : (
          <h3>You have not set any goals</h3>
        )}
      </section>   
    </>
  )
}

export default Dashboard
