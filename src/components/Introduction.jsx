import { useLanguage } from '../context/LanguageContext'
import content from '../data/content.json'

export default function Introduction() {
  const { language } = useLanguage()
  const { title, paragraphs } = content.introduction[language]

  return (
    <div className="page-content intro-content">
      <h2 className="intro-title">{title}</h2>
      {paragraphs.map((p, i) => (
        <p key={i} className="intro-paragraph">{p}</p>
      ))}
      <div className="intro-categories">
        <div className="intro-cat-card frontend-bg">
          <span className="intro-cat-icon">&#127760;</span>
          <h3>{language === 'sq' ? 'Frontend' : 'Frontend'}</h3>
          <p>{language === 'sq' ? 'Ndërfaqja vizuele e web-it' : 'Visual interface of the web'}</p>
        </div>
        <div className="intro-cat-card backend-bg">
          <span className="intro-cat-icon">&#9881;</span>
          <h3>{language === 'sq' ? 'Backend' : 'Backend'}</h3>
          <p>{language === 'sq' ? 'Logjika dhe të dhënat në server' : 'Server logic and data'}</p>
        </div>
        <div className="intro-cat-card fullstack-bg">
          <span className="intro-cat-icon">&#128187;</span>
          <h3>{language === 'sq' ? 'Full Stack' : 'Full Stack'}</h3>
          <p>{language === 'sq' ? 'Frontend + Backend së bashku' : 'Frontend + Backend together'}</p>
        </div>
      </div>
    </div>
  )
}
