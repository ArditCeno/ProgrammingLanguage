import { useLanguage } from '../context/LanguageContext'
import content from '../data/content.json'

const categoryColors = {
  'Frontend': { bg: 'rgba(245, 158, 11, 0.15)', color: '#d97706', label: 'Frontend' },
  'Backend': { bg: 'rgba(59, 130, 246, 0.15)', color: '#2563eb', label: 'Backend' },
  'Full Stack': { bg: 'rgba(139, 92, 246, 0.15)', color: '#7c3aed', label: 'Full Stack' },
}

function LanguagePage({ lang, side }) {
  const { language } = useLanguage()
  const cat = categoryColors[lang.category]
  const data = lang[language]

  return (
    <div className={`language-page ${side}`}>
      <div className="lang-header">
        <img
          className="lang-logo"
          src={lang.logoUrl}
          alt={lang.name}
          onError={(e) => { e.target.style.display = 'none' }}
        />
        <h2 className="lang-name">{lang.name}</h2>
        <span
          className="lang-category"
          style={{ backgroundColor: cat.bg, color: cat.color, border: `1px solid ${cat.color}` }}
        >
          {cat.label}
        </span>
      </div>

      <p className="lang-description">{data.description}</p>

      <div className="lang-usage">
        <strong>{language === 'sq' ? 'Përdoret për:' : 'Used for:'}</strong> {data.usage}
      </div>

      <div className="lang-code">
        <div className="code-header">
          <span className="code-dot red"></span>
          <span className="code-dot yellow"></span>
          <span className="code-dot green"></span>
          <span className="code-label">{language === 'sq' ? 'Shembull' : 'Example'}</span>
        </div>
        <pre><code>{data.example}</code></pre>
      </div>

      <div className="lang-funfact">
        <span className="funfact-icon">&#9889;</span>
        <p>{data.funFact}</p>
      </div>
    </div>
  )
}

export default function LanguageSpread({ leftIndex, rightIndex }) {
  const languages = content.languages

  return (
    <div className="language-spread">
      <div className="page-left-border">
        <LanguagePage lang={languages[leftIndex]} side="left" />
      </div>
      <div className="page-divider"></div>
      <div className="page-right-border">
        <LanguagePage lang={languages[rightIndex]} side="right" />
      </div>
    </div>
  )
}
