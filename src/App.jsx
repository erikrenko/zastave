import { useState, useEffect } from 'react'
import Header from './components/Header'
import MapView from './components/MapView'
import Gallery from './components/Gallery'
import TriviaView from './components/TriviaView'
import PassportModal from './components/PassportModal'
import CountryOfDay from './components/CountryOfDay'
import { countries } from './data'

export default function App() {
  const [view, setView] = useState('map')
  const [uppercase, setUppercase] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    document.body.classList.toggle('uppercase-mode', uppercase)
  }, [uppercase])

  const selected = countries.find((c) => c.id === selectedId) || null

  return (
    <>
      <Header
        view={view}
        setView={setView}
        uppercase={uppercase}
        setUppercase={setUppercase}
        search={search}
        setSearch={setSearch}
      />
      <CountryOfDay countries={countries} onSelect={setSelectedId} />
      <main>
        <MapView active={view === 'map'} countries={countries} onSelect={setSelectedId} />
        <Gallery active={view === 'gallery'} countries={countries} search={search} onSelect={setSelectedId} />
        <TriviaView active={view === 'trivia'} countries={countries} />
      </main>
      {selected && <PassportModal country={selected} onClose={() => setSelectedId(null)} />}
    </>
  )
}
