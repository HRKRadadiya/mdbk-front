import { useMemo } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import { persistReducer } from 'redux-persist'
import reducers from './reducers/rootReducer'
import { myStorage } from '../service/storage'


let store: any;

const persistConfig = {
	key: 'root',
	storage: myStorage,
	blacklist: ['projectCreate']
}

const persistedReducer = persistReducer(persistConfig, reducers)

function initStore(initialState: any) {

	let middlewareList = [thunkMiddleware] // logger

	return createStore(
		persistedReducer,
		initialState,
		composeWithDevTools(applyMiddleware(...middlewareList))
	)
}

export const initializeStore = (preloadedState: any) => {
	let _store = store ?? initStore(preloadedState)

	// After navigating to a page with an initial Redux state, merge that state
	// with the current state in the store, and create a new store
	if (preloadedState && store) {
		_store = initStore({
			...store.getState(),
			...preloadedState,
		})
		// Reset the current store
		store = undefined
	}

	// For SSG and SSR always create a new store
	if (typeof window === 'undefined') return _store
	// Create the store once in the client
	if (!store) store = _store

	return _store
}

export function useStore(initialState: any) {
	const store = useMemo(() => initializeStore(initialState), [initialState])
	return store
}