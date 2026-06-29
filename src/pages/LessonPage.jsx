import { useMemo, useState } from 'react'
import { CalendarDays, Check, ChevronRight, Flame, Gauge, Star, Target, Trophy, X, Zap } from 'lucide-react'
import { allLessons, curriculum } from '../data/curriculum'

export default function LessonPage({ lesson, onExit, onComplete, reviewMode = false }) {
  const questions = lesson.questions.length
    ? lesson.questions
    : curriculum[0].lessons[0].questions.map((q, index) => ({
        ...q,
        prompt: index === 0 ? `Practice check: ${q.prompt}` : q.prompt,
      }))
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(null)
  const [textAnswer, setTextAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState([])
  const [answerHistory, setAnswerHistory] = useState([])
  const question = questions[step]
  const questionKey = question.key || `${lesson.id}-${step}`

  const isCorrect = useMemo(() => {
    if (!checked) return false
    if (question.type === 'choice' || question.type === 'match') return selected === question.answer
    const submitted = textAnswer.trim().toLowerCase()
    return [question.answer, ...(question.alternatives || [])].some(
      (answer) => answer.toLowerCase() === submitted,
    )
  }, [checked, question, selected, textAnswer])

  function checkAnswer() {
    if (((question.type === 'choice' || question.type === 'match') && selected === null) || (question.type === 'fill' && !textAnswer.trim())) return
    setChecked(true)
    const correct =
      ((question.type === 'choice' || question.type === 'match') && selected === question.answer) ||
      (question.type === 'fill' &&
        [question.answer, ...(question.alternatives || [])].some(
          (answer) => answer.toLowerCase() === textAnswer.trim().toLowerCase(),
        ))
    const answerRecord = {
      ...question,
      key: questionKey,
      lessonId: question.lessonId || lesson.id,
      correct,
      submittedAnswer: question.type === 'choice' || question.type === 'match' ? question.options[selected] : textAnswer.trim(),
      correctAnswer: question.type === 'choice' || question.type === 'match' ? question.options[question.answer] : question.answer,
    }
    if (correct) {
      setCorrectCount((value) => value + 1)
    } else {
      setWrongAnswers((current) => [...current, answerRecord])
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
    setTextAnswer('')
    setChecked(false)
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
          <span>{question.type === 'choice' ? 'Multiple choice' : question.type === 'match' ? 'Matching' : 'Type the answer'}</span>
        </div>
        <span className="eyebrow">{question.type === 'choice' ? 'CHOOSE THE BEST ANSWER' : question.type === 'match' ? 'MATCH THE PAIR' : 'FILL IN THE BLANK'}</span>
        <h1>{question.prompt}</h1>
        {question.type === 'choice' || question.type === 'match' ? (
          <div className="options">
            {question.options.map((option, index) => (
              <button
                key={option}
                disabled={checked}
                className={`${selected === index ? 'selected' : ''} ${
                  checked && index === question.answer ? 'correct' : ''
                } ${checked && selected === index && index !== question.answer ? 'wrong' : ''}`}
                onClick={() => setSelected(index)}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {option}
                {checked && index === question.answer && <Check size={19} />}
              </button>
            ))}
          </div>
        ) : (
          <input
            className={`fill-input ${checked ? (isCorrect ? 'correct' : 'wrong') : ''}`}
            value={textAnswer}
            disabled={checked}
            onChange={(event) => setTextAnswer(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && !checked && checkAnswer()}
            placeholder="Type your answer"
            autoFocus
          />
        )}
        {checked && (
          <div className={`feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
            <div>{isCorrect ? <Check size={20} /> : <X size={20} />}</div>
            <p><strong>{isCorrect ? 'Exactly right.' : `Correct answer: ${question.type === 'choice' || question.type === 'match' ? question.options[question.answer] : question.answer}`}</strong>{question.explanation}</p>
          </div>
        )}
        <div className="question-actions">
          <button className="text-button" onClick={onExit}>Exit lesson</button>
          <button
            className="primary-button"
            disabled={!checked && (question.type === 'fill' ? !textAnswer.trim() : selected === null)}
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


