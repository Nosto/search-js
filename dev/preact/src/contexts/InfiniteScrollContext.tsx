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

export function UserPreferencesProvider({ children }: UserPreferencesProviderProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    isInfiniteScrollEnabled: false,
    isInjectionEnabled: false
  })

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
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
