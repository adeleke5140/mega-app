import { useEffect, useState, useRef } from "react"
import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from "./custom-plugin"

function App() {
  const ref = useRef<esbuild.Service>()
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm'
    })
  }

  useEffect(() => {
    startService()
  }, [])

  const handleClick = async () => {
    if (!ref.current) {
      return;
    }
    const service = ref.current
    const result = await service.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()]
    })
    setCode(result.outputFiles[0].text)
  }
  return (
    <div className="App">
      <h1 style={{ fontFamily: 'monospace' }}>Transpile and Bundle with Esbuild-wasm.</h1>
      <form onSubmit={(e) => { e.preventDefault() }}>
        <textarea name="user-input" id="user-input" value={input} onChange={e => setInput(e.target.value)}></textarea>
        <button style={{ display: 'block' }} onClick={handleClick}>Submit</button>
      </form>
      <div>
        <pre>
          {code}
        </pre>
      </div>
    </div>
  )
}

export default App
