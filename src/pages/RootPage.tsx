import { useRouter } from '../hooks'

function RootPage() {
  const { push } = useRouter()

  return (
    <main>
      <h1>root</h1>
      <button type='button' onClick={() => push('/about')}>
        about
      </button>
    </main>
  )
}

export default RootPage
