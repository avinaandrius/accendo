import { useMemo, useState } from 'react'
import { CalendarDays, Check, ChevronRight, Flame, Gauge, Star, Target, Trophy, X, Zap } from 'lucide-react'
import { allLessons, curriculum } from '../data/curriculum'

function shuffleArray(items) {
  return items
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item)
}

function prepareQuestion(question, lessonId, index) {
  const key = question.key || `${lessonId}-${index}`
  if (question.type === 'choice') {
    const shuffledOptions = shuffleArray(question.options.map((text, originalIndex) => ({ text, originalIndex })))
    return {
      ...question,
      key,
      shuffledOptions,
      shuffledAnswer: shuffledOptions.findIndex((option) => option.originalIndex === question.answer),
    }
  }
  if (question.type === 'true_false') {
    const options = [
      { text: 'True', value: true },
      { text: 'False', value: false },
    ]
    return {
      ...question,
      key,
      shuffledOptions: options,
      shuffledAnswer: options.findIndex((option) => option.value === question.answer),
    }
  }
  if (question.type === 'matching') {
    const pairs = question.pairs.map((pair, pairIndex) => ({ ...pair, id: `${key}-pair-${pairIndex}` }))
    return {
      ...question,
      key,
      pairs,
      shuffledRight: shuffleArray(pairs.map((pair) => ({ id: pair.id, text: pair.right }))),
    }
  }
  return { ...question, key }
}

function MatchingQuestion({ question, checked, matches, selectedLeft, setSelectedLeft, setMatches }) {
  function chooseLeft(pairId) {
    if (checked) return
    setSelectedLeft(selectedLeft === pairId ? null : pairId)
  }

  function chooseRight(rightId) {
    if (checked || !selectedLeft) return
    setMatches((current) => {
      const withoutRight = Object.fromEntries(Object.entries(current).filter(([, value]) => value !== rightId))
      return { ...withoutRight, [selectedLeft]: rightId }
    })
    setSelectedLeft(null)
  }

  return (
    <div className="matching-board">
      <div className="matching-column">
        {question.pairs.map((pair, index) => {
          const matchedRight = matches[pair.id]
          const isCorrect = checked && matchedRight === pair.id
          const isWrong = checked && matchedRight && matchedRight !== pair.id
          return (
            <button
              key={pair.id}
              className={`${selectedLeft === pair.id ? 'selected' : ''} ${matchedRight ? 'matched' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
              onClick={() => chooseLeft(pair.id)}
              type="button"
            >
              <span>{index + 1}</span>
              {pair.left}
            </button>
          )
        })}
      </div>
      <div className="matching-column">
        {question.shuffledRight.map((item, index) => {
          const usedBy = Object.entries(matches).find(([, rightId]) => rightId === item.id)?.[0]
          const isCorrect = checked && usedBy === item.id
          const isWrong = checked && usedBy && usedBy !== item.id
          return (
            <button
              key={item.id}
              className={`${usedBy ? 'matched' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
              disabled={checked || !selectedLeft}
              onClick={() => chooseRight(item.id)}
              type="button"
            >
              <span>{String.fromCharCode(65 + index)}</span>
              {item.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function LessonPage({ lesson, onExit, onComplete, reviewMode = false }) {
  const rawQuestions = lesson.questions.length
    ? lesson.questions
    : curriculum[0].lessons[0].questions.map((q, index) => ({
        ...q,
        prompt: index === 0 ? `Practice check: ${q.prompt}` : q.prompt,
      }))
  const questions = useMemo(() => rawQuestions.map((question, index) => prepareQuestion(question, lesson.id, index)), [lesson.id, rawQuestions])
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(null)
  const [matches, setMatches] = useState({})
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [checked, setChecked] = useState(false)
  const [finished, setFinished] = useState(false)
  const [answerHistory, setAnswerHistory] = useState([])
  const question = questions[step]
  const questionKey = question.key || `${lesson.id}-${step}`

  const matchingComplete = question.type === 'matching' && Object.keys(matches).length === question.pairs.length
  const isCorrect = useMemo(() => {
    if (!checked) return false
    if (question.type === 'matching') return question.pairs.every((pair) => matches[pair.id] === pair.id)
    return selected === question.shuffledAnswer
  }, [checked, question, selected, matches])

  function formatMatchingAnswer(questionToFormat, answerMatches = matches) {
    return questionToFormat.pairs
      .map((pair) => {
        const selectedRightId = answerMatches[pair.id]
        const selectedRight = questionToFormat.pairs.find((item) => item.id === selectedRightId)?.right || 'Not matched'
        return `${pair.left} → ${selectedRight}`
      })
      .join('; ')
  }

  function checkAnswer() {
    if ((question.type === 'matching' && !matchingComplete) || (question.type !== 'matching' && selected === null)) return
    const correct = question.type === 'matching'
      ? question.pairs.every((pair) => matches[pair.id] === pair.id)
      : selected === question.shuffledAnswer
    setChecked(true)
    const originalSelectedIndex = question.type === 'choice' ? question.shuffledOptions[selected]?.originalIndex : null
    const answerRecord = {
      ...question,
      key: questionKey,
      lessonId: question.lessonId || lesson.id,
      correct,
      submittedAnswer: question.type === 'matching'
        ? formatMatchingAnswer(question)
        : question.shuffledOptions[selected]?.text,
      correctAnswer: question.type === 'matching'
        ? question.pairs.map((pair) => `${pair.left} → ${pair.right}`).join('; ')
        : question.shuffledOptions[question.shuffledAnswer]?.text,
      selectedOriginalIndex: originalSelectedIndex,
      submittedMatches: { ...matches },
    }
    setAnswerHistory((current) => [...current, answerRecord])
  }

  function nextQuestion() {
    if (step === questions.length - 1) {
      const finalCorrect = answerHistory.filter((answer) => answer.correct).length
      const finalWrong = answerHistory.filter((answer) => !answer.correct)
      setFinished(true)
      onComplete({
        lesson,
        correct: finalCorrect,
        total: questions.length,
        wrongAnswers: finalWrong,
        reviewedKeys: questions.map((item, index) => item.key || `${lesson.id}-${index}`),
      })
      return
    }
    setStep((value) => value + 1)
    setSelected(null)
    setMatches({})
    setSelectedLeft(null)
    setChecked(false)
  }

  function questionTypeLabel() {
    if (question.type === 'choice') return 'Multiple choice'
    if (question.type === 'true_false') return 'True / false'
    return 'Matching'
  }

  function eyebrowLabel() {
    if (question.type === 'choice') return 'CHOOSE THE BEST ANSWER'
    if (question.type === 'true_false') return 'TRUE OR FALSE'
    return 'MATCH THE CONCEPTS'
  }

  if (finished) {
    const finalCorrect = answerHistory.filter((answer) => answer.correct).length
    const missedAnswers = answerHistory.filter((answer) => !answer.correct)
    const accuracy = Math.round((finalCorrect / questions.length) * 100)
    const passedGate = !lesson.isCheckIn || accuracy >= (lesson.passingScore || 80)
    const readinessBump = passedGate ? (lesson.isCheckIn ? 3 : missedAnswers.length ? 1 : 2) : 0
    const tomorrowLesson = allLessons[allLessons.findIndex((item) => item.id === lesson.id) + 1]
    return (
      <main className="lesson-shell celebration-shell">
        <div className="celebration">
          <div className="celebration-burst"><span /><span /><span /></div>
          <div className="celebration-icon"><Trophy size={46} /></div>
          <span className="eyebrow">{reviewMode ? 'REVIEW COMPLETE' : lesson.isCheckIn ? 'CHECK-IN COMPLETE' : 'LESSON COMPLETE'}</span>
          <h1>{reviewMode ? 'Review complete.' : lesson.isCheckIn && !passedGate ? 'Retake needed.' : accuracy >= 80 ? 'Lesson complete.' : 'Good rep. Review next.'}</h1>
          <p>{lesson.isCheckIn && !passedGate ? `You scored ${accuracy}%. Score ${lesson.passingScore || 80}% or higher to unlock the next lesson.` : `You answered ${finalCorrect} of ${questions.length} correctly${reviewMode ? '.' : ` and earned ${lesson.xp} XP.`}`}</p>
          <div className="reward-row">
            <div><Zap size={22} /><strong>{reviewMode ? 'Done' : `+${lesson.xp}`}</strong><span>{reviewMode ? 'reviewed' : 'XP earned'}</span></div>
            <div><Gauge size={22} /><strong>{readinessBump ? `+${readinessBump}%` : 'Hold'}</strong><span>readiness</span></div>
            <div><Star size={22} /><strong>{accuracy}%</strong><span>accuracy</span></div>
          </div>
          <div className="completion-summary">
            <span><Flame size={17} /> Streak status: protected</span>
            <span><Target size={17} /> {missedAnswers.length} mistake{missedAnswers.length === 1 ? '' : 's'} saved for review</span>
            {tomorrowLesson && <span><CalendarDays size={17} /> Tomorrow: {tomorrowLesson.title}</span>}
          </div>
          <div className="answer-review">
            <div className="answer-review-header">
              <span className="eyebrow">QUESTION REVIEW</span>
              <strong>{accuracy >= 80 ? 'Keep moving' : 'Fix these before they become habits'}</strong>
            </div>
            {answerHistory.map((answer, index) => (
              <div className={`review-row ${answer.correct ? 'correct' : 'wrong'}`} key={answer.key}>
                <div>{answer.correct ? <Check size={17} /> : <X size={17} />}</div>
                <span>
                  <strong>Question {index + 1}: {answer.correct ? 'Correct' : 'Missed'}</strong>
                  {!answer.correct && <small>Your answer: {answer.submittedAnswer || 'Blank'} · Correct: {answer.correctAnswer}</small>}
                </span>
              </div>
            ))}
          </div>
          <button className="primary-button" onClick={onExit}>{lesson.isCheckIn && !passedGate ? 'Back to study path' : 'Continue learning'} <ChevronRight size={18} /></button>
        </div>
      </main>
    )
  }

  return (
    <main className="lesson-shell">
      <header className="lesson-header">
        <button className="icon-button" onClick={onExit} aria-label="Exit lesson"><X /></button>
        <div className="lesson-progress-track"><span style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
        <span>{step + 1} / {questions.length}</span>
      </header>
      <section className="question-card">
        <div className="question-meta">
          <span>{reviewMode ? 'Mistake review' : lesson.title}</span>
          <span>{questionTypeLabel()}</span>
        </div>
        <span className="eyebrow">{eyebrowLabel()}</span>
        <h1>{question.prompt}</h1>
        {question.type === 'matching' ? (
          <MatchingQuestion
            question={question}
            checked={checked}
            matches={matches}
            selectedLeft={selectedLeft}
            setSelectedLeft={setSelectedLeft}
            setMatches={setMatches}
          />
        ) : (
          <div className="options">
            {question.shuffledOptions.map((option, index) => (
              <button
                key={`${questionKey}-${option.text}`}
                disabled={checked}
                className={`${selected === index ? 'selected' : ''} ${
                  checked && index === question.shuffledAnswer ? 'correct' : ''
                } ${checked && selected === index && index !== question.shuffledAnswer ? 'wrong' : ''}`}
                onClick={() => setSelected(index)}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {option.text}
                {checked && index === question.shuffledAnswer && <Check size={19} />}
              </button>
            ))}
          </div>
        )}
        {checked && (
          <div className={`feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
            <div>{isCorrect ? <Check size={20} /> : <X size={20} />}</div>
            <p>
              <strong>{isCorrect ? 'Exactly right.' : `Correct answer: ${question.type === 'matching' ? question.pairs.map((pair) => `${pair.left} → ${pair.right}`).join('; ') : question.shuffledOptions[question.shuffledAnswer]?.text}`}</strong>
              {question.explanation}
              {!isCorrect && question.type === 'choice' && question.incorrectExplanations?.[question.shuffledOptions[selected]?.originalIndex - 1] && (
                <em>{question.incorrectExplanations[question.shuffledOptions[selected].originalIndex - 1]}</em>
              )}
            </p>
          </div>
        )}
        <div className="question-actions">
          <button className="text-button" onClick={onExit}>Exit lesson</button>
          <button
            className="primary-button"
            disabled={!checked && (question.type === 'matching' ? !matchingComplete : selected === null)}
            onClick={checked ? nextQuestion : checkAnswer}
          >
            {checked ? (step === questions.length - 1 ? 'Finish lesson' : 'Next question') : 'Check answer'}
            <ChevronRight size={18} />
          </button>
        </div>
      </section>
    </main>
  )
}
