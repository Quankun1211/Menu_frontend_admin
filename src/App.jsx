import { Suspense } from 'react'
import {RouterProvider} from 'react-router-dom'
import router from './routes'
function App() {

  return (
    <div className="dark:bg-gray-900 text-black dark:text-white">
      <Suspense>
        <RouterProvider router={router}/>
      </Suspense>
    </div>
  )
}

export default App
