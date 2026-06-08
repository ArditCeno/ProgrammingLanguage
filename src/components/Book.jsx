import { useState, useCallback } from 'react'
import BookCover from './BookCover'
import Introduction from './Introduction'
import LanguageSpread from './LanguageSpread'
import LanguageToggle from './LanguageToggle'
import '../styles/book.css'
import content from '../data/content.json'

const TOTAL_SPREADS = 1 + 1 + Math.ceil(content.languages.length / 2)

export default function Book() {
  const [spread, setSpread] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState(null)

  const handleNext = useCallback(() => {
    if (animating || spread >= TOTAL_SPREADS - 1) return
    setDirection('next')
    setAnimating(true)
    setTimeout(() => {
      setSpread(s => s + 1)
      setAnimating(false)
      setDirection(null)
    }, 900)
  }, [animating, spread])

  const handlePrev = useCallback(() => {
    if (animating || spread <= 0) return
    setDirection('prev')
    setAnimating(true)
    setTimeout(() => {
      setSpread(s => s - 1)
      setAnimating(false)
      setDirection(null)
    }, 900)
  }, [animating, spread])

  const renderSpread = (index) => {
    if (index === 0) return <BookCover onStart={handleNext} />
    if (index === 1) return (
      <div className="page-single"><Introduction /></div>
    )
    const langStart = (index - 2) * 2
    return (
      <LanguageSpread
        leftIndex={langStart}
        rightIndex={Math.min(langStart + 1, content.languages.length - 1)}
      />
    )
  }

  const getLabel = () => {
    if (spread === 0) return ''
    if (spread === 1) return 'Hyrje'
    const langIdx = (spread - 2) * 2
    const left = content.languages[langIdx]?.name || ''
    const right = content.languages[langIdx + 1]?.name || ''
    return `${left} & ${right}`
  }

  return (
    <div className="book-wrapper">
      <LanguageToggle />

      <div className="book-3d">
        {animating && direction === 'next' && (
          <div className="book-spread target">
            {renderSpread(spread + 1)}
          </div>
        )}
        {animating && direction === 'prev' && (
          <div className="book-spread target">
            {renderSpread(spread - 1)}
          </div>
        )}

        <div className={`book-spread current ${animating ? `flipping-${direction}` : ''}`}>
          {renderSpread(spread)}
        </div>

        {spread > 0 && (
          <button
            className="nav-btn nav-prev"
            onClick={handlePrev}
            disabled={animating || spread <= 0}
            aria-label="Previous"
          >
            ‹
          </button>
        )}
        {spread < TOTAL_SPREADS - 1 && (
          <button
            className="nav-btn nav-next"
            onClick={handleNext}
            disabled={animating || spread >= TOTAL_SPREADS - 1}
            aria-label="Next"
          >
            ›
          </button>
        )}
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
    </div>
  )
}
