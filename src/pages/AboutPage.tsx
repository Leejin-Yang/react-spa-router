import { useRouter } from '../hooks'

function AboutPage() {
  const { push } = useRouter()

  return (
    <main>
      <h1>about</h1>
      <button type='button' onClick={() => push('/')}>
        go main
      </button>
    </main>
  )
}

export default AboutPage
