import { createContext, useEffect, useMemo, useReducer } from 'react'
import { initialAppData } from '../data/initialState'
import { appDataReducer } from '../reducers/appDataReducer'
import { loadAppData, saveAppData } from '../services/localStorageService'

export const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const [state, dispatch] = useReducer(appDataReducer, initialAppData, (fallback)=>loadAppData(fallback))

  useEffect(() => {
    saveAppData(state)
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}
