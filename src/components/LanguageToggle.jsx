import { useLanguage } from '../context/LanguageContext'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <button
      className="lang-toggle"
      onClick={() => setLanguage(language === 'sq' ? 'en' : 'sq')}
      title={language === 'sq' ? 'Switch to English' : 'Kalo në Shqip'}
    >
      <span className={`toggle-option ${language === 'sq' ? 'active' : ''}`}>SQ</span>
      <span className="toggle-slider">
        <span className={`toggle-thumb ${language === 'en' ? 'right' : ''}`}></span>
      </span>
      <span className={`toggle-option ${language === 'en' ? 'active' : ''}`}>EN</span>
    </button>
  )
}
