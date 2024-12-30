import React from 'react'
import Login from './user/Login'
import Signup from './user/SignUp'
import UploadCourse from './admin/create_course'
function App() {
  return (
    <div>

     
      {/* <Signup/> */}
 <Login></Login>

      <UploadCourse/>

    </div>
  )
}

export default App