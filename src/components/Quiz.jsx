import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import content from '../data/content.json'

const quiz = content.quiz
const txt = content.quizContent

export default function Quiz({
  startIndex, count, isLast,
  quizAnswers, quizSubmittedSpreads,
  onAnswer, onSubmitSpread, onNext
}) {
  const { language } = useLanguage()
  const t = txt[language]
  const [showResults, setShowResults] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  const currentQIndices = Array.from({ length: count }, (_, i) => startIndex + i)
  const allAnswered = currentQIndices.every(idx => quizAnswers[idx] !== undefined)
  const submitted = currentQIndices.every(idx => quizSubmittedSpreads[idx])

  const handleSelect = (qIdx, optionIdx) => {
    if (submitted) return
    onAnswer(qIdx, optionIdx)
  }

  const handleSubmit = () => {
    onSubmitSpread(currentQIndices)
  }

  const calcScore = () => {
    let totalCorrect = 0
    let totalWrong = 0
    Object.entries(quizAnswers).forEach(([qIdx, ans]) => {
      if (quiz[parseInt(qIdx)].correct === ans) totalCorrect++
      else totalWrong++
    })
    return { totalCorrect, totalWrong, score: totalCorrect * 2 - totalWrong * 1 }
  }

  const handleFinish = () => {
    const { totalCorrect, totalWrong, score } = calcScore()
    setFinalScore(score)
    setShowResults(true)
  }

  const handleRestart = () => {
    setShowResults(false)
    setFinalScore(0)
    window.location.reload()
  }

  if (showResults) {
    const total = quiz.length * 2
    const { totalCorrect, totalWrong } = calcScore()
    let msg = t.poor
    if (finalScore >= total) msg = t.perfect
    else if (finalScore >= total * 0.7) msg = t.good
    else if (finalScore >= total * 0.4) msg = t.average

    return (
      <div className="quiz-results">
        <div className="quiz-results-icon">{finalScore >= total * 0.7 ? '\uD83C\uDFC6' : finalScore >= total * 0.4 ? '\uD83D\uDC4D' : '\uD83D\uDCDA'}</div>
        <h2 className="quiz-results-title">{t.resultsTitle}</h2>
        <div className="quiz-score">{finalScore} {t.outOf}</div>
        <div className="quiz-score-detail">
          {totalCorrect} {language === 'sq' ? 'te sakta' : 'correct'} (+{totalCorrect * 2}) &middot; {totalWrong} {language === 'sq' ? 'te gabuara' : 'wrong'} (-{totalWrong})
        </div>
        <p className="quiz-results-msg">{msg}</p>
        <button className="quiz-restart-btn" onClick={handleRestart}>{t.restart}</button>
      </div>
    )
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2 className="quiz-title">{t.title}</h2>
        <p className="quiz-desc">{t.description}</p>
      </div>
      <div className="quiz-questions">
        {currentQIndices.map((qIdx) => {
          const q = quiz[qIdx]
          if (!q) return null
          const data = q[language]
          const selected = quizAnswers[qIdx]
          const isCorrect = submitted && selected === data.correct
          const isWrong = submitted && selected !== undefined && selected !== data.correct
          const isSubmitted = submitted

          return (
            <div key={qIdx} className={`quiz-question ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}>
              <div className="quiz-q-num">{t.progress} {qIdx + 1}</div>
              <p className="quiz-q-text">{data.question}</p>
              <div className="quiz-options">
                {data.options.map((opt, oi) => {
                  const isSelected = selected === oi
                  const isOptCorrect = isSubmitted && oi === data.correct
                  const isOptWrong = isSubmitted && isSelected && oi !== data.correct
                  return (
                    <label
                      key={oi}
                      className={`quiz-option ${isSelected ? 'selected' : ''} ${isOptCorrect ? 'correct-opt' : ''} ${isOptWrong ? 'wrong-opt' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`q-${qIdx}`}
                        checked={isSelected}
                        onChange={() => handleSelect(qIdx, oi)}
                        disabled={isSubmitted}
                      />
                      <span className="quiz-opt-circle" />
                      <span className="quiz-opt-text">{opt}</span>
                      {isOptCorrect && <span className="quiz-opt-check">&#10003;</span>}
                    </label>
                  )
                })}
              </div>
              {isSubmitted && (
                <div className={`quiz-feedback ${isCorrect ? 'correct-fb' : 'wrong-fb'}`}>
                  {isCorrect ? t.correctMsg : t.wrongMsg}
                </div>
              )}
            </div>
          )
        })}
      </div>
      {!submitted && (
        <button className="quiz-submit-btn" disabled={!allAnswered} onClick={handleSubmit}>
          {language === 'sq' ? 'Kontrollo Pergjigjet' : 'Check Answers'}
        </button>
      )}
      {submitted && !isLast && (
        <button className="quiz-next-btn" onClick={onNext}>
          {language === 'sq' ? 'Vazhdo' : 'Continue'} &#8250;
        </button>
      )}
      {submitted && isLast && (
        <button className="quiz-submit-btn" onClick={handleFinish}>
          {language === 'sq' ? 'Shiko Rezultatin' : 'View Results'}
        </button>
      )}
    </div>
  )
}
