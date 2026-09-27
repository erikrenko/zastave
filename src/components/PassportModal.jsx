import { useState, useEffect } from 'react'
import { flagUrl, crestUrl, continentLabels } from '../data'
import StatusBadge from './StatusBadge'

export default function PassportModal({ country, onClose }) {
  const [visualMode, setVisualMode] = useState('flag')
  const [tab, setTab] = useState('story')
  const [zoomOpen, setZoomOpen] = useState(false)

  useEffect(() => {
    setVisualMode('flag')
    setTab('story')
    setZoomOpen(false)
  }, [country])

  if (!country) return null

  const imgSrc = visualMode === 'coat' ? crestUrl(country) : flagUrl(country)

  function speak() {
    window.speechSynthesis.cancel()
    const text = `${country.name_sl}. Glavno mesto je ${country.capital_sl}. ${country.flag_meaning_sl}`
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'sl-SI'
    u.rate = 0.9
    window.speechSynthesis.speak(u)
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="passport-card">
        <div className="passport-header">
          <div className="passport-title">
            <h2>{country.name_sl}<StatusBadge country={country} /></h2>
            <span className="continent-tag">{continentLabels[country.region] || country.region}</span>
          </div>
          <div className="passport-actions">
            <button className="audio-btn" onClick={speak}>🔊 Poslušaj zgodbo</button>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="passport-body">
          <div className="passport-left">
            <div className="visual-toggle-box">
              <div className="visual-img-container">
                <img className="visual-img" src={imgSrc} alt={country.name_sl} />
                <button className="zoom-btn" title="Povečaj sliko" onClick={() => setZoomOpen(true)}>🔎</button>
              </div>
              <div className="visual-switch">
                <button className={`switch-btn ${visualMode === 'flag' ? 'active' : ''}`} onClick={() => setVisualMode('flag')}>🇸🇮 Zastava</button>
                <button className={`switch-btn ${visualMode === 'coat' ? 'active' : ''}`} onClick={() => setVisualMode('coat')}>🛡️ Grb</button>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-cube"><div className="stat-icon">🏛️</div><div className="stat-info"><h4>Glavno mesto</h4><p>{country.capital_sl}</p></div></div>
              <div className="stat-cube"><div className="stat-icon">👥</div><div className="stat-info"><h4>Prebivalci</h4><p>{country.population}</p></div></div>
              <div className="stat-cube"><div className="stat-icon">🗣️</div><div className="stat-info"><h4>Uradni jezik</h4><p>{country.language_sl}</p></div></div>
              <div className="stat-cube"><div className="stat-icon">💶</div><div className="stat-info"><h4>Valuta</h4><p>{country.currency_sl}</p></div></div>
            </div>
          </div>

          <div className="passport-right">
            <div className="content-tabs">
              <button className={`tab-btn ${tab === 'story' ? 'active' : ''}`} onClick={() => setTab('story')}>📖 Zgodba zastave</button>
              <button className={`tab-btn ${tab === 'facts' ? 'active' : ''}`} onClick={() => setTab('facts')}>💡 Ali veš?</button>
            </div>

            {tab === 'story' && (
              <div className="tab-pane active">
                <div className="story-card">
                  <h3>Pomen barv in zgodovina</h3>
                  <p>{country.flag_meaning_sl}</p>
                </div>
                <div className="story-card">
                  <h3>Grb</h3>
                  <p>{country.crest_meaning_sl}</p>
                  {country.hotspots?.length > 0 && (
                    <ul className="symbol-list">
                      {country.hotspots.map((hs, i) => (
                        <li key={i}><strong>{hs.title_sl}:</strong> {hs.desc_sl}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {tab === 'facts' && (
              <div className="tab-pane active">
                <div className="fun-facts-list">
                  {country.trivia_sl?.map((f, i) => (
                    <div className="fact-item" key={i}>
                      <span style={{ fontSize: 22 }}>💡</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {zoomOpen && (
        <div className="zoom-overlay" onClick={(e) => { e.stopPropagation(); setZoomOpen(false) }}>
          <button className="zoom-close" onClick={(e) => { e.stopPropagation(); setZoomOpen(false) }}>✕</button>
          <img className="zoom-img" src={imgSrc} alt={country.name_sl} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}
