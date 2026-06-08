import { LanguageProvider } from './context/LanguageContext'
import Book from './components/Book'

function App() {
  return (
    <LanguageProvider>
      <Book />
    </LanguageProvider>
  )
}

export default App
