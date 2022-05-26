import { persistStore } from 'redux-persist'
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { useStore } from '../redux/store'
import '../styles/globals.css'
import 'antd/dist/antd.css';
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles/admin_style.css'
import '../styles/custom.css'
import '../styles/profile.css'
import '../styles/PCustom.css'
import '../styles/authRegister.css'
import MainLayout from '../components/MainLayout';
import { ConfigProvider } from 'antd';
import { useState } from 'react';
import enUS from 'antd/lib/locale/en_US';
import ko_KR from 'antd/lib/locale/ko_KR';
import { useRouter } from 'next/router'
import '../styles/forumPopup.css'
import moment from 'moment';
import 'moment/locale/ko';
import '../styles/fourmQuestin.css'
import "../styles/fixResponsive.css";
import "../styles/forumDesignFixing.css"
import '../styles/m4.css'

function MyApp({ Component, pageProps }: AppProps) {

	const store = useStore(pageProps.initialReduxState)
	const persistor = persistStore(store)
	const router = useRouter()
	const __renderLoading = () => (
		<span></span>
	)

	const currentLanguage = router.locale ?? 'kr'
	const [locale] = useState(currentLanguage == "en" ? enUS : ko_KR)
	moment.locale(currentLanguage == 'en' ? 'en' : 'ko');

	return (
		<Provider store={store}>
			<PersistGate loading={__renderLoading()} persistor={persistor}>
				<MainLayout>
					<ConfigProvider locale={locale}>
						<Component {...pageProps} />
					</ConfigProvider>
				</MainLayout>
			</PersistGate>
		</Provider>
	)
}
export default appWithTranslation(MyApp)
