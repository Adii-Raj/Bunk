import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

console.log('🔥 main.jsx is running')
console.log('React version:', React.version)

const rootElement = document.getElementById('root')
console.log('Root element found:', !!rootElement)

if (!rootElement) {
  console.error('❌ Root element not found!')
} else {
  console.log('✅ Root element found, creating React root...')
  
  const root = ReactDOM.createRoot(rootElement)
  
  try {
    root.render(<App />)
    console.log('✅ App rendered successfully')
  } catch (error) {
    console.error('❌ Error rendering app:', error)
  }
}