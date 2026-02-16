import { createContext, useContext, useState } from 'react'

const SidebarContext = createContext(null)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  // Retourner des valeurs par défaut si le contexte n'est pas disponible
  // Cela évite les erreurs si utilisé en dehors du provider
  if (!context) {
    return {
      mobileOpen: false,
      handleDrawerToggle: () => {}
    }
  }
  return context
}

export const SidebarProvider = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <SidebarContext.Provider value={{ mobileOpen, handleDrawerToggle }}>
      {children}
    </SidebarContext.Provider>
  )
}
