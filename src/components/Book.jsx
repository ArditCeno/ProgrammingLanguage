import { useState, useCallback, useRef, useEffect } from 'react'
import LanguageToggle from './LanguageToggle'
import Quiz from './Quiz'
import '../styles/book.css'
import content from '../data/content.json'
import { useLanguage } from '../context/LanguageContext'

const categoryColors = {
  'Frontend': { bg: 'rgba(245, 158, 11, 0.15)', color: '#d97706', label: 'Frontend' },
  'Backend': { bg: 'rgba(59, 130, 246, 0.15)', color: '#2563eb', label: 'Backend' },
  'Full Stack': { bg: 'rgba(139, 92, 246, 0.15)', color: '#7c3aed', label: 'Full Stack' },
}

const languages = content.languages
const quiz = content.quiz
const QUIZ_START = 2 + languages.length
const TOTAL_SPREADS = QUIZ_START + Math.ceil(quiz.length / 3)

/* ====== RENDER HELPERS ====== */

function CoverPage({ onStart }) {
  return (
    <div className="cover-page">
      <div className="cover-shimmer" />
      <div className="cover-content">
        <div className="cover-decoration">
          <div className="cover-line" />
          <div className="cover-line-thick" />
          <span className="cover-icon">&#128218;</span>
          <div className="cover-line-thick" />
          <div className="cover-line" />
        </div>
        <h1 className="cover-title">
          GJUHET E PROGRAMIMIT
          <span className="cover-title-line">PROGRAMMING LANGUAGES</span>
        </h1>
        <p className="cover-subtitle">
          Nje udhezues per 15 gjuhet me te njohura te programimit
        </p>
        <div className="cover-categories">
          <span className="cover-cat frontend">Frontend</span>
          <span className="cover-cat backend">Backend</span>
          <span className="cover-cat fullstack">Full Stack</span>
        </div>
        <button className="cover-btn" onClick={onStart}>Hape Librin</button>
      </div>
    </div>
  )
}

function Endpaper() {
  return <div className="endpaper" />
}

function IntroPage({ side }) {
  const { language } = useLanguage()
  const { title, paragraphs } = content.introduction[language]
  if (side === 'left') {
    return (
      <div className="intro-content">
        <h2 className="intro-title">{title}</h2>
        {paragraphs.slice(0, 2).map((p, i) => <p key={i} className="intro-paragraph">{p}</p>)}
      </div>
    )
  }
  return (
    <div className="intro-content">
      {paragraphs.slice(2).map((p, i) => <p key={i} className="intro-paragraph">{p}</p>)}
      <div className="intro-categories">
        <div className="intro-cat-card frontend-bg">
          <span className="intro-cat-icon">&#127760;</span>
          <h3>Frontend</h3>
          <p>{language === 'sq' ? 'Nderfaqja vizuele e web-it' : 'Visual interface of the web'}</p>
        </div>
        <div className="intro-cat-card backend-bg">
          <span className="intro-cat-icon">&#9881;</span>
          <h3>Backend</h3>
          <p>{language === 'sq' ? 'Logjika dhe te dhenat ne server' : 'Server logic and data'}</p>
        </div>
        <div className="intro-cat-card fullstack-bg">
          <span className="intro-cat-icon">&#128187;</span>
          <h3>Full Stack</h3>
          <p>{language === 'sq' ? 'Frontend + Backend se bashku' : 'Frontend + Backend together'}</p>
        </div>
      </div>
    </div>
  )
}

function LanguagePageLeft({ lang }) {
  const { language } = useLanguage()
  const cat = categoryColors[lang.category]
  const data = lang.page1[language]
  return (
    <div className="lang-page">
      <div className="lang-header">
        <img className="lang-logo" src={lang.logoUrl} alt={lang.name} onError={(e) => { e.target.style.display = 'none' }} />
        <h2 className="lang-name">{lang.name}</h2>
        <span className="lang-category" style={{ backgroundColor: cat.bg, color: cat.color, border: `1px solid ${cat.color}` }}>{cat.label}</span>
      </div>
      <h3 className="lang-section-title">{data.title}</h3>
      {data.paragraphs.map((p, i) => <p key={i} className="lang-description">{p}</p>)}
      <div className="lang-features">
        <h4>{language === 'sq' ? 'Karakteristikat Kryesore' : 'Key Features'}</h4>
        <ul>{data.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
      </div>
      <div className="lang-usage"><strong>{language === 'sq' ? 'Perdorimi:' : 'Usage:'}</strong> {data.usage}</div>
    </div>
  )
}

function LanguagePageRight({ lang }) {
  const { language } = useLanguage()
  const data = lang.page2[language]
  return (
    <div className="lang-page">
      <h3 className="lang-section-title">{data.title}</h3>
      <div className="lang-funfacts">
        {data.funFacts.map((f, i) => (
          <div key={i} className="lang-funfact-card">
            <span className="funfact-icon">&#9889;</span>
            <p>{f}</p>
          </div>
        ))}
      </div>
      <div className="lang-companies">
        <h4>{language === 'sq' ? 'Kompanite qe e perdorin' : 'Companies using it'}</h4>
        <p>{data.companies}</p>
      </div>
      <div className="lang-proscons">
        <div className="lang-pros">
          <h4>{language === 'sq' ? 'Perpare' : 'Pros'}</h4>
          <ul>{data.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>
        <div className="lang-cons">
          <h4>{language === 'sq' ? 'Kunder' : 'Cons'}</h4>
          <ul>{data.cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </div>
      </div>
      <div className="lang-code">
        <div className="code-header">
          <span className="code-dot red" /><span className="code-dot yellow" /><span className="code-dot green" />
          <span className="code-label">{language === 'sq' ? 'Shembull' : 'Example'}</span>
        </div>
        <pre><code>{data.example}</code></pre>
      </div>
    </div>
  )
}

function renderLeftHalf(spreadIndex, onStart) {
  if (spreadIndex === 0) return <Endpaper />
  if (spreadIndex === 1) return <IntroPage side="left" />
  if (spreadIndex >= QUIZ_START) return null
  const lang = languages[spreadIndex - 2]
  return lang ? <LanguagePageLeft lang={lang} /> : null
}

function renderRightHalf(spreadIndex, onStart) {
  if (spreadIndex === 0) return <CoverPage onStart={onStart} />
  if (spreadIndex === 1) return <IntroPage side="right" />
  if (spreadIndex >= QUIZ_START) return null
  const lang = languages[spreadIndex - 2]
  return lang ? <LanguagePageRight lang={lang} /> : null
}

function renderPageNumber(spreadIndex, side) {
  if (spreadIndex <= 0) return null
  if (spreadIndex >= QUIZ_START) return null
  const num = spreadIndex === 1 ? (side === 'left' ? 'ii' : 'iii') : String(spreadIndex + (side === 'left' ? 0 : 1))
  return <span className={`page-number ${side}`}>{num}</span>
}

function BookContent({ spreadIndex, showLeft, showRight, flipping, onStart }) {
  return (
    <>
      {showLeft && <div className={`left-page${flipping === 'prev' ? ' flip-hidden' : ''}`}>{renderLeftHalf(spreadIndex, onStart)}{renderPageNumber(spreadIndex, 'left')}</div>}
      {showRight && <div className={`right-page${flipping === 'next' ? ' flip-hidden' : ''}`}>{renderRightHalf(spreadIndex, onStart)}{renderPageNumber(spreadIndex, 'right')}</div>}
    </>
  )
}

function FlipContent({ spreadIndex, side, onStart }) {
  return <div className="flip-content">{side === 'left' ? renderLeftHalf(spreadIndex, onStart) : renderRightHalf(spreadIndex, onStart)}</div>
}

/* ====== MAIN BOOK COMPONENT ====== */

export default function Book() {
  const [spread, setSpread] = useState(0)
  const [animState, setAnimState] = useState('idle')
  const [showHint, setShowHint] = useState(true)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmittedSpreads, setQuizSubmittedSpreads] = useState({})
  const animRef = useRef(null)
  const touchRef = useRef({ startX: 0, startY: 0 })

  const handleNext = useCallback(() => {
    if (animState !== 'idle' || spread >= TOTAL_SPREADS - 1) return
    setAnimState('next-flip')
    animRef.current = setTimeout(() => {
      setSpread(s => s + 1)
      setAnimState('idle')
    }, 1150)
  }, [animState, spread])

  const handlePrev = useCallback(() => {
    if (animState !== 'idle' || spread <= 0) return
    setAnimState('prev-flip')
    animRef.current = setTimeout(() => {
      setSpread(s => s - 1)
      setAnimState('idle')
    }, 1150)
  }, [animState, spread])

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); handleNext() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); handlePrev() }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [handleNext, handlePrev])

  useEffect(() => {
    const el = document.querySelector('.book-wrapper')
    if (!el) return
    const onStart = (e) => { const t = e.touches[0]; touchRef.current = { startX: t.clientX, startY: t.clientY } }
    const onEnd = (e) => {
      const t = e.changedTouches[0]; const dx = t.clientX - touchRef.current.startX; const dy = t.clientY - touchRef.current.startY
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 0.7) return
      if (dx > 0) handlePrev(); else handleNext()
    }
    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchend', onEnd, { passive: true })
    return () => { el.removeEventListener('touchstart', onStart); el.removeEventListener('touchend', onEnd) }
  }, [handleNext, handlePrev])

  useEffect(() => {
    if (spread > 0 && showHint) {
      const t = setTimeout(() => setShowHint(false), 4000)
      return () => clearTimeout(t)
    }
  }, [spread, showHint])

  const handleClickLeft = useCallback(() => { if (spread > 0) handlePrev() }, [spread, handlePrev])
  const handleClickRight = useCallback(() => { if (spread < TOTAL_SPREADS - 1) handleNext() }, [spread, handleNext])

  const { language } = useLanguage()

  const getLabel = () => {
    if (spread === 0) return ''
    if (spread === 1) return 'Hyrje'
    if (spread >= QUIZ_START) {
      const qnum = (spread - QUIZ_START) * 3 + 1
      return `${content.quizContent[language].title} (${qnum}-${Math.min(qnum + 2, quiz.length)})`
    }
    return languages[spread - 2]?.name || ''
  }

  const isFlippingNext = animState === 'next-flip'
  const isFlippingPrev = animState === 'prev-flip'
  const isFlipping = isFlippingNext || isFlippingPrev
  const isQuiz = spread >= QUIZ_START
  const currentQIndices = isQuiz ? Array.from({ length: Math.min(3, quiz.length - (spread - QUIZ_START) * 3) }, (_, i) => (spread - QUIZ_START) * 3 + i) : []
  const currentQuizDone = isQuiz && currentQIndices.length > 0 && currentQIndices.every(idx => quizSubmittedSpreads[idx])
  const canNext = spread < TOTAL_SPREADS - 1 && (!isQuiz || currentQuizDone)
  const canPrev = spread > 0

  return (
    <div className="book-wrapper">
      <LanguageToggle />
      <div className="book-container-outer">
        <div className="book-shadow" />
        <div className="book">
          <div className="book-spine" />
          <div className="book-ribbon" />
          <div className="page-edges-right" />
          <div className="page-edges-bottom" />
          <div className="spread-area">
            <div className="gutter-shadow" />
            {!isFlipping && !isQuiz && (
              <BookContent spreadIndex={spread} showLeft showRight flipping={null} onStart={handleNext} />
            )}
            {isFlippingNext && !isQuiz && (
              <>
                <BookContent spreadIndex={spread + 1} showLeft showRight flipping={null} onStart={handleNext} />
                <BookContent spreadIndex={spread} showLeft showRight={false} flipping={null} onStart={handleNext} />
                <div className="flipping-page next active">
                  <div className="flip-shadow" />
                  <div className="flip-front"><FlipContent spreadIndex={spread} side="right" onStart={handleNext} />{renderPageNumber(spread, 'right')}</div>
                  <div className="flip-back"><FlipContent spreadIndex={spread + 1} side="left" onStart={handleNext} /></div>
                </div>
              </>
            )}
            {isFlippingPrev && !isQuiz && (
              <>
                <BookContent spreadIndex={spread - 1} showLeft showRight flipping={null} onStart={handleNext} />
                <BookContent spreadIndex={spread} showLeft={false} showRight flipping={null} onStart={handleNext} />
                <div className="flipping-page prev active">
                  <div className="flip-shadow" />
                  <div className="flip-front"><FlipContent spreadIndex={spread} side="left" onStart={handleNext} />{renderPageNumber(spread, 'left')}</div>
                  <div className="flip-back"><FlipContent spreadIndex={spread - 1} side="right" onStart={handleNext} /></div>
                </div>
              </>
            )}
            {isQuiz && (
              <Quiz
                startIndex={(spread - QUIZ_START) * 3}
                count={Math.min(3, quiz.length - (spread - QUIZ_START) * 3)}
                isLast={spread === TOTAL_SPREADS - 1}
                quizAnswers={quizAnswers}
                quizSubmittedSpreads={quizSubmittedSpreads}
                onAnswer={(qIdx, ans) => setQuizAnswers(prev => ({ ...prev, [qIdx]: ans }))}
                onSubmitSpread={(qIndices) => setQuizSubmittedSpreads(prev => {
                  const next = { ...prev }
                  qIndices.forEach(i => { next[i] = true })
                  return next
                })}
                onNext={handleNext}
              />
            )}
            {!isFlipping && !isQuiz && canPrev && <div className="click-left" onClick={handleClickLeft} />}
            {!isFlipping && !isQuiz && canNext && <div className="click-right" onClick={handleClickRight} />}
          </div>
          {canPrev && <button className="nav-btn nav-prev" onClick={handlePrev} disabled={isFlipping} aria-label="Previous">&#8249;</button>}
          {canNext && <button className="nav-btn nav-next" onClick={handleNext} disabled={isFlipping} aria-label="Next">&#8250;</button>}
        </div>
      </div>
      {spread > 0 && (
        <>
          <div className="book-label">{getLabel()}</div>
          <div className="book-progress">
            {Array.from({ length: TOTAL_SPREADS - 1 }, (_, i) => <span key={i} className={`dot ${i + 1 === spread ? 'active' : ''}`} />)}
          </div>
        </>
      )}
      <div className={`keyboard-hint ${!showHint || spread === 0 ? 'hidden' : ''}`}>
        <kbd>&larr;</kbd><span> ose kliko majtas  &middot;  </span><kbd>&rarr;</kbd><span> ose kliko djathtas</span>
      </div>
    </div>
  )
}
