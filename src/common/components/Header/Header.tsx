import { NavLink } from 'react-router'
import s from './Header.module.css'
import { Path } from '@/common/routing'
import { useGetMeQuery, useLogoutMutation } from '@/feature/auth/api/authApi.ts'
import { Login } from '@/feature/auth/ui/Login/Login.tsx'

const navItems = [
  { to: Path.Main, label: 'Main' },
  { to: Path.Playlists, label: 'Playlists' },
  { to: Path.Tracks, label: 'Tracks' },
  { to: Path.Profile, label: 'Profile' },
]

export const Header = () => {
  const { data } = useGetMeQuery()
  const [logout] = useLogoutMutation()

  const handlerLogout = () => logout()

  return (
    <header className={s.container}>
      <nav>
        <ul className={s.list}>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => `link ${isActive ? s.activeLink : ''}`}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {data && (
        <div className={s.loginContainer}>
          <p>{data.login}</p>
          <button onClick={handlerLogout}>logout</button>
        </div>
      )}
      {!data && <Login />}
    </header>
  )
}
