import App from '../App'

const HomePage = ({ user, onLogout }) => {
  return <App user={user} onLogout={onLogout} />
}

export default HomePage
