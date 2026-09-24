import { useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { flagUrl, crestUrl } from '../data'

export default function TriviaView({ active, countries }) {
  const [mode, setMode] = useState('coat')
  const [current, setCurrent] = useState(null)
  const [options, setOptions] = useState([])
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(null)

  const next = useCallback(() => {
    const c = countries[Math.floor(Math.random() * countries.length)]
    const opts = [c]
    while (opts.length < 4 && opts.length < countries.length) {
      const r = countries[Math.floor(Math.random() * countries.length)]
      if (!opts.includes(r)) opts.push(r)
    }
    opts.sort(() => Math.random() - 0.5)
    setCurrent(c)
    setOptions(opts)
    setAnswered(null)
  }, [countries])

  useEffect(() => {
    if (countries.length) next()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, countries.length])

  if (!current) return <section className={`view ${active ? 'active' : ''}`} id="trivia-view" />

  const question =
    mode === 'coat' ? 'Kateri državi pripada ta grb?' : mode === 'flag' ? 'Kateri državi pripada ta zastava?' : `Katero je glavno mesto države ${current.name_sl}?`
  const img = mode === 'coat' ? crestUrl(current) : flagUrl(current)

  function choose(opt) {
    if (answered) return
    const correct = opt.id === current.id
    setAnswered({ id: opt.id, correct })
    if (correct) {
      setScore((s) => s + 10)
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } })
    }
    setTimeout(next, 1200)
  }

  return (
    <section className={`view ${active ? 'active' : ''}`} id="trivia-view">
      <div className="trivia-box">
        <div className="trivia-header">
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-muted)' }}>Izziv za raziskovalca</span>
          <div className="score-badge">Točke: {score} 🔥</div>
        </div>

        <div className="trivia-mode-selector">
          <button className={`mode-btn ${mode === 'coat' ? 'active' : ''}`} onClick={() => setMode('coat')}>🛡️ Ugani grb</button>
          <button className={`mode-btn ${mode === 'flag' ? 'active' : ''}`} onClick={() => setMode('flag')}>🌍 Ugani zastavo</button>
          <button className={`mode-btn ${mode === 'capital' ? 'active' : ''}`} onClick={() => setMode('capital')}>🏛️ Glavno mesto</button>
        </div>

        <h2 className="trivia-question">{question}</h2>
        <img className="trivia-symbol-display" src={img} alt="" />

        <div className="options-grid">
          {options.map((opt) => {
            const label = mode === 'capital' ? opt.capital_sl : opt.name_sl
            let cls = 'option-btn'
            if (answered) {
              if (opt.id === current.id) cls += ' correct'
              else if (opt.id === answered.id) cls += ' wrong'
            }
            return (
              <button key={opt.id} className={cls} onClick={() => choose(opt)}>
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
