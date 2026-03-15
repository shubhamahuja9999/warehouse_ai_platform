import React, { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext()

export function useData() {
  return useContext(DataContext)
}

export function DataProvider({ children }) {
  const [ordersFile, setOrdersFile] = useState(null)
  const [inventoryFile, setInventoryFile] = useState(null)
  const [returnsFile, setReturnsFile] = useState(null)

  const [ordersData, setOrdersData] = useState(null)
  const [inventoryData, setInventoryData] = useState(null)
  const [returnsData, setReturnsData] = useState(null)

  const [lastUploaded, setLastUploaded] = useState({})
  const [loading, setLoading] = useState({})
  const [error, setError] = useState({})

  const setLoad = (key, val) => setLoading(p => ({ ...p, [key]: val }))
  const setErr = (key, val) => setError(p => ({ ...p, [key]: val }))

  const clearAllData = () => {
    setOrdersData(null)
    setInventoryData(null)
    setReturnsData(null)
    
    setOrdersFile(null)
    setInventoryFile(null)
    setReturnsFile(null)
    
    setLastUploaded({})
    setLoading({})
    setError({})
  }

  const value = {
    // Files
    ordersFile, setOrdersFile,
    inventoryFile, setInventoryFile,
    returnsFile, setReturnsFile,
    
    // Data
    ordersData, setOrdersData,
    inventoryData, setInventoryData,
    returnsData, setReturnsData,
    
    // UI State
    lastUploaded, setLastUploaded,
    loading, setLoad,
    error, setErr,
    
    // Actions
    clearAllData
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}
