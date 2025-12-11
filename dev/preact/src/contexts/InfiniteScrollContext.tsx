import { type ComponentChildren, createContext } from "preact"
import { useContext, useState } from "preact/hooks"

interface UserPreferences {
  isInfiniteScrollEnabled: boolean
  isInjectionEnabled: boolean
}

interface UserPreferencesContextType {
  preferences: UserPreferences
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void
}

const UserPreferencesContext = createContext<UserPreferencesContextType | null>(null)

interface UserPreferencesProviderProps {
  children: ComponentChildren
}

const localStorageKey = "nosto:search-js-dev:user-preferences"

export function UserPreferencesProvider({ children }: UserPreferencesProviderProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences)

  // eslint-disable-next-line func-style
  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences(prev => {
      const newPreferences = {
        ...prev,
        [key]: value
      }
      savePreferences(newPreferences)
      return newPreferences
    })
  }

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        updatePreference
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  )
}

function loadPreferences(): UserPreferences {
  const preferences = localStorage.getItem(localStorageKey)
  return {
    isInfiniteScrollEnabled: false,
    isInjectionEnabled: false,
    ...(preferences ? (JSON.parse(preferences) as UserPreferences) : {})
  }
}

function savePreferences(preferences: UserPreferences) {
  localStorage.setItem(localStorageKey, JSON.stringify(preferences))
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext)
  if (!context) {
    throw new Error("useUserPreferences must be used within a UserPreferencesProvider")
  }
  return context
}

export function useInfiniteScroll() {
  const { preferences, updatePreference } = useUserPreferences()
  return {
    isInfiniteScrollEnabled: preferences.isInfiniteScrollEnabled,
    toggleInfiniteScroll: () => updatePreference("isInfiniteScrollEnabled", !preferences.isInfiniteScrollEnabled)
  }
}

export function useInjectionLogic() {
  const { preferences, updatePreference } = useUserPreferences()
  return {
    isInjectionEnabled: preferences.isInjectionEnabled,
    toggleInjection: () => updatePreference("isInjectionEnabled", !preferences.isInjectionEnabled)
  }
}
