import '../styles/globals.css'
import { RecoilRoot } from 'recoil';
import App from './App';

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <App>
        <Component {...pageProps} />
      </App>
    </RecoilRoot>
  )
}

export default MyApp
