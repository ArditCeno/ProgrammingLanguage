import { useState, useCallback, useRef, useEffect } from 'react'
import LanguageToggle from './LanguageToggle'
import '../styles/book.css'
import content from '../data/content.json'
import { useLanguage } from '../context/LanguageContext'

const categoryColors = {
  'Frontend': { bg: 'rgba(245, 158, 11, 0.15)', color: '#d97706', label: 'Frontend' },
  'Backend': { bg: 'rgba(59, 130, 246, 0.15)', color: '#2563eb', label: 'Backend' },
  'Full Stack': { bg: 'rgba(139, 92, 246, 0.15)', color: '#7c3aed', label: 'Full Stack' },
}

const languages = content.languages
const TOTAL_SPREADS = 1 + 1 + Math.ceil(languages.length / 2)

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
          Një udhëzues për 15 gjuhët më të njohura të programimit
        </p>
        <div className="cover-categories">
          <span className="cover-cat frontend">Frontend</span>
          <span className="cover-cat backend">Backend</span>
          <span className="cover-cat fullstack">Full Stack</span>
        </div>
        <button className="cover-btn" onClick={onStart}>
          Hape Librin
        </button>
      </div>
    </div>
  )
}

function Endpaper() {
  return (
    <div className="endpaper" />
  )
}

function IntroPage({ side }) {
  const { language } = useLanguage()
  const { title, paragraphs } = content.introduction[language]

  if (side === 'left') {
    return (
      <div className="intro-content">
        <h2 className="intro-title">{title}</h2>
        {paragraphs.slice(0, 2).map((p, i) => (
          <p key={i} className="intro-paragraph">{p}</p>
        ))}
      </div>
    )
  }

  return (
    <div className="intro-content">
      {paragraphs.slice(2).map((p, i) => (
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

function LanguagePage({ lang }) {
  const { language } = useLanguage()
  const cat = categoryColors[lang.category]
  const data = lang[language]

  return (
    <div className="lang-page">
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
          <span className="code-dot red" />
          <span className="code-dot yellow" />
          <span className="code-dot green" />
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

/* ====== SPREAD RENDERERS ====== */

function renderLeftHalf(spreadIndex) {
  if (spreadIndex === 0) return <Endpaper />
  if (spreadIndex === 1) return <IntroPage side="left" />
  const langIdx = (spreadIndex - 2) * 2
  const lang = languages[langIdx]
  return lang ? <LanguagePage lang={lang} /> : null
}

function renderRightHalf(spreadIndex, onStart) {
  if (spreadIndex === 0) return <CoverPage onStart={onStart} />
  if (spreadIndex === 1) return <IntroPage side="right" />
  const langIdx = (spreadIndex - 2) * 2 + 1
  const lang = languages[Math.min(langIdx, languages.length - 1)]
  return lang ? <LanguagePage lang={lang} /> : null
}

function renderPageNumber(spreadIndex, side) {
  if (spreadIndex <= 0) return null
  const num = spreadIndex <= 1
    ? (side === 'left' ? 'ii' : 'iii')
    : String((spreadIndex - 2) * 2 + (side === 'left' ? 1 : 2))
  return <span className={`page-number ${side}`}>{num}</span>
}

/* ====== BOOK CONTENT ====== */

function BookContent({ spreadIndex, showLeft, showRight, flipping, onStart }) {
  return (
    <>
      {showLeft && (
        <div className={`left-page${flipping === 'prev' ? ' flip-hidden' : ''}`}>
          {renderLeftHalf(spreadIndex)}
          {renderPageNumber(spreadIndex, 'left')}
        </div>
      )}
      {showRight && (
        <div className={`right-page${flipping === 'next' ? ' flip-hidden' : ''}`}>
          {renderRightHalf(spreadIndex, onStart)}
          {renderPageNumber(spreadIndex, 'right')}
        </div>
      )}
    </>
  )
}

function FlipContent({ spreadIndex, side, onStart }) {
  return (
    <div className="flip-content">
      {side === 'left' ? renderLeftHalf(spreadIndex) : renderRightHalf(spreadIndex, onStart)}
    </div>
  )
}

/* ====== MAIN BOOK COMPONENT ====== */

export default function Book() {
  const [spread, setSpread] = useState(0)
  const [animState, setAnimState] = useState('idle')
  const [showHint, setShowHint] = useState(true)
  const animRef = useRef(null)
  const hintRef = useRef(null)

  const handleNext = useCallback(() => {
    if (animState !== 'idle' || spread >= TOTAL_SPREADS - 1) return
    setAnimState('next-flip')
    animRef.current = setTimeout(() => {
      setSpread(s => s + 1)
      setAnimState('idle')
    }, 1250)
  }, [animState, spread])

  const handlePrev = useCallback(() => {
    if (animState !== 'idle' || spread <= 0) return
    setAnimState('prev-flip')
    animRef.current = setTimeout(() => {
      setSpread(s => s - 1)
      setAnimState('idle')
    }, 1250)
  }, [animState, spread])

  /* Keyboard navigation */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  /* Hide keyboard hint after first interaction */
  useEffect(() => {
    if (spread > 0 && showHint) {
      const timer = setTimeout(() => setShowHint(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [spread, showHint])

  /* Click on left/right half of the book */
  const handleClickLeft = useCallback(() => {
    if (spread > 0) handlePrev()
  }, [spread, handlePrev])

  const handleClickRight = useCallback(() => {
    if (spread < TOTAL_SPREADS - 1) handleNext()
  }, [spread, handleNext, TOTAL_SPREADS])

  const getLabel = () => {
    if (spread === 0) return ''
    if (spread === 1) return 'Hyrje'
    const idx = (spread - 2) * 2
    const left = languages[idx]?.name || ''
    const right = languages[idx + 1]?.name || ''
    return `${left} & ${right}`
  }

  const isFlippingNext = animState === 'next-flip'
  const isFlippingPrev = animState === 'prev-flip'
  const isFlipping = isFlippingNext || isFlippingPrev

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

            {!isFlipping && (
              <BookContent
                spreadIndex={spread}
                showLeft
                showRight
                flipping={null}
                onStart={handleNext}
              />
            )}

            {isFlippingNext && (
              <>
                <BookContent
                  spreadIndex={spread + 1}
                  showLeft
                  showRight
                  flipping={null}
                  onStart={handleNext}
                />
                <BookContent
                  spreadIndex={spread}
                  showLeft
                  showRight={false}
                  flipping={null}
                  onStart={handleNext}
                />
                <div className="flipping-page next active">
                  <div className="flip-front">
                    <FlipContent spreadIndex={spread} side="right" onStart={handleNext} />
                    {renderPageNumber(spread, 'right')}
                  </div>
                  <div className="flip-back">
                    <FlipContent spreadIndex={spread + 1} side="left" onStart={handleNext} />
                    <span className="page-number left" style={{ left: 40 }}>
                      {spread + 1 <= 1 ? 'ii' : String((spread - 1) * 2 + 1)}
                    </span>
                  </div>
                </div>
              </>
            )}

            {isFlippingPrev && (
              <>
                <BookContent
                  spreadIndex={spread - 1}
                  showLeft
                  showRight
                  flipping={null}
                  onStart={handleNext}
                />
                <BookContent
                  spreadIndex={spread}
                  showLeft={false}
                  showRight
                  flipping={null}
                  onStart={handleNext}
                />
                <div className="flipping-page prev active">
                  <div className="flip-front">
                    <FlipContent spreadIndex={spread} side="left" onStart={handleNext} />
                    {renderPageNumber(spread, 'left')}
                  </div>
                  <div className="flip-back">
                    <FlipContent spreadIndex={spread - 1} side="right" onStart={handleNext} />
                    <span className="page-number right" style={{ right: 40 }}>
                      {spread - 1 <= 1 ? 'i' : String((spread - 3) * 2 + 2)}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Click zones on book pages */}
            {!isFlipping && spread > 0 && (
              <div className="click-left" onClick={handleClickLeft} />
            )}
            {!isFlipping && spread < TOTAL_SPREADS - 1 && (
              <div className="click-right" onClick={handleClickRight} />
            )}
          </div>

          {spread > 0 && (
            <button
              className="nav-btn nav-prev"
              onClick={handlePrev}
              disabled={isFlipping}
              aria-label="Previous"
            >
              &#8249;
            </button>
          )}
          {spread < TOTAL_SPREADS - 1 && (
            <button
              className="nav-btn nav-next"
              onClick={handleNext}
              disabled={isFlipping}
              aria-label="Next"
            >
              &#8250;
            </button>
          )}
        </div>
      </div>

      {spread > 0 && (
        <>
          <div className="book-label">{getLabel()}</div>
          <div className="book-progress">
            {Array.from({ length: TOTAL_SPREADS - 1 }, (_, i) => (
              <span key={i} className={`dot ${i + 1 === spread ? 'active' : ''}`} />
            ))}
          </div>
        </>
      )}

      <div className={`keyboard-hint ${!showHint || spread === 0 ? 'hidden' : ''}`}>
        <kbd>&larr;</kbd>
        <span> ose kliko majtas &nbsp;&middot;&nbsp; </span>
        <kbd>&rarr;</kbd>
        <span> ose kliko djathtas</span>
      </div>
    </div>
  )
}
