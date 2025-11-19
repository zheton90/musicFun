// import { Routing } from '../../common/routing/Routing.tsx'
import s from './App.module.css'
import { Header } from '@/common/components'
import { Routing } from '@/common/routing'
import { ToastContainer } from 'react-toastify'
import { LinearProgress } from '@/common/components/LinearProgress/LinearProgress.tsx'
import { useGlobalLoading } from '@/common/hooks/useGlobalLoading.ts'

export function App() {
  const isGlobalLoading = useGlobalLoading()

  return (
    <>
      <Header />
      {isGlobalLoading && <LinearProgress />}
      <div className={s.layout}>
        <Routing />
      </div>
      <ToastContainer />
    </>
  )
}
