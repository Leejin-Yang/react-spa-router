# React SPA Router

React와 History API 사용해 SPA Router 기능 구현

<br>

## 1) 주소에 맞는 페이지 렌더링

[https://developer.mozilla.org/ko/docs/Web/API/Window/location](https://developer.mozilla.org/ko/docs/Web/API/Window/location)

[https://developer.mozilla.org/ko/docs/Web/API/Location](https://developer.mozilla.org/ko/docs/Web/API/Location)

Location 객체에 pathname 프로퍼티가 있다.

- domain.com/ 에서는 pathname: ‘/’
- domain.com/about 에서는 pathnaim: ‘/about’

pathname 값을 가져와 App에서 조건문을 통해 해당 페이지를 렌더링 해주었다.

![location object](https://user-images.githubusercontent.com/78616893/194302602-ced66484-b42a-4972-95ad-cc7d7e512a01.png)

<br>

## 2) 페이지 이동 버튼

### History API

[https://developer.mozilla.org/ko/docs/Web/API/History](https://developer.mozilla.org/ko/docs/Web/API/History)

history.pushState

```tsx
history.pushState(state, title[, url]);
```

history.pushState로 url을 이동했을 때 이동은 되지만 화면이 다시 렌더링되지 않는다. 뒤로가기를 했을 때 마찬가지로 렌더링이 되지 않는다. 주소 목록에 새로운 주소를 추가할 뿐 이벤트가 발생하지 않는다. 히스토리 스택의 데이터를 push하고 제공된 url로 이동한다.

### window.popstate

[https://developer.mozilla.org/ko/docs/Web/API/Window/popstate_event](https://developer.mozilla.org/ko/docs/Web/API/Window/popstate_event)

History API의 go, forward, back 메소드(뒤로가기, 앞으로 가기)가 실행될 때 popstate 이벤트가 실행된다. 여기서 pushState나 replaceState는 popstate 이벤트를 발생시키지 않는다.

버튼 클릭 시 페이지의 컨텐츠를 렌더링 하려면 어떻게 해야할까? 페이지가 이동되었다는 것을 듣는 listener가 필요할 것 같다. pathname 상태를 통해 이동되었다는 것을 감지하게 하였다.

앱의 글로벌 상태이기에 React Context를 이용해 전역으로 관리했다. 버튼 클릭시 pushState로 히스토리 스택을 쌓고 상태 업테이트를 통해 해당 경로로 이동되었다는 것을 알려주었다.

```tsx
const onClick = () => {
  history.pushState(null, '', '/about')
  setLocation(location.pathname)
}
```

<br>

## 3) Router, Route 컴포넌트

react-router와 같은 형태로 컴포넌트를 구현해본다.

```tsx
ReactDOM.createRoot(container).render(
  <Router>
    <Route path='/' component={<Root />} />
    <Route path='/about' component={<About />} />
  </Router>
)
```

이전까지 작업한 형태는 다음과 같다.

```tsx
return (
  <LocationContext.Provider value={{ basename, setLocation }}>
    {basename === '/about' ? <AboutPage /> : <RootPage />}
  </LocationContext.Provider>
)
```

형태가 비슷하게 보여진다. 위의 Router는 context를 제공하는 최상위 컴포넌트로 보인다. 우선 Router 컴포넌트를 생성하고 context 관련 코드를 전부 옮겨보았다.

Route 컴포넌트는 context에 저장된 현재 위치와 prop으로 받은 path를 비교해 컴포넌트 렌더 유무를 판단하면 된다.

<br>

## 4) useRouter

경로를 받아 그 페이지로 보내는 push. 이전에 각 페이지마다 구현한 push 함수를 useRouter hook을 생성해 각 페이지마다 사용하도록 한다.

```tsx
import { useContext } from 'react'

import LocationContext from '../contexts/LocationContext'

export function useRouter() {
  const { setLocation } = useContext(LocationContext)

  const push = (path: string) => {
    history.pushState(null, '', path)
    setLocation(location.pathname)
  }

  useEffect(() => {
    const onPopState = () => {
      setLocation(location.pathname)
    }

    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  return { push }
}
```

그리고 popstate는 페이지 이동을 감지해 발생하는 이벤트이기에 Router 컴포넌트에서 useRouter 훅으로 이동시켰다. 그렇게 Router 컴포넌트에서는 현재 경로에 대한 상태를 제공해주는 역할만 하게되고, useRouter hook에서는 push나 뒤로가기 앞으로 가기 등 페이지 이동에 대한 이벤트를 다루게 된다.
