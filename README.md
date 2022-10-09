# React SPA Router

React와 History API 사용해 SPA Router 기능 구현

<br>

## 1) 주소에 맞는 페이지 렌더링

[https://developer.mozilla.org/ko/docs/Web/API/Window/location](https://developer.mozilla.org/ko/docs/Web/API/Window/location)

[https://developer.mozilla.org/ko/docs/Web/API/Location](https://developer.mozilla.org/ko/docs/Web/API/Location)

Location 객체에 pathname 프로퍼티가 있다.

- domain.com/ 에서는 pathname: ‘/’
- domain.com/about 에서는 pathname: ‘/about’

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

### Context API

버튼 클릭 시 페이지의 컨텐츠를 렌더링 하려면 어떻게 해야할까? 페이지가 이동되었다는 것을 듣는 listener가 필요할 것 같다. pathname 상태를 통해 이동되었다는 것을 감지하게 하였다.

앱의 글로벌 상태이기에 React Context API를 이용해 전역으로 관리했다. 버튼 클릭시 pushState로 히스토리 스택을 쌓고 상태 업테이트를 통해 해당 경로로 이동되었다는 것을 알려주었다.

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

<br>

## 5) 개선

![multiple-route](https://user-images.githubusercontent.com/78616893/194750955-16694b84-74b2-42b0-aab8-c2888ed80402.png)

```tsx
function App() {
  return (
    <Router>
      <Route path='/' component={<RootPage />} />
      <Route path='/about' component={<AboutPage />} />
    </Router>
  )
}

export default App
```

실제 페이지에서 보면 해당 페이지의 Route 컴포넌트만 있는 것이 아닌 Route 전체가 보여진다. 만약 경로가 많아진다면 수많은 컴포넌트들이 null 값인 채로 보여지고 있을 것이다.

react-router의 구조를 보면 다음과 같은 컴포넌트 단계를 볼 수 있다.

`<Router />` → `<Routes />` → `<Route />`

```tsx
<Router>
  <Routes>
    <Route />
    <Route />
    <Route />
  </Routes>
</Router>
```

실질적으로 컴포넌트를 렌더링 하는 컴포넌트는 Route가 아니라 Routes였다. 해당 컴포넌트만 렌더할 수 있게 Routes 컴포넌트를 생성한다.

![routes-children-object-array](https://user-images.githubusercontent.com/78616893/194751012-d63bdb80-050f-41a0-b2d4-5a6070fed884.png)

Route를 여러개 보내주고 Route가 받은 children을 콘솔을 찍어 보면 객체의 배열로 오는 것을 볼 수 있다(children으로 받는 컴포넌트가 여러개인 경우). 정보를 보면 그 컴포넌트가 받은 props도 볼 수 있어 이를 통해 해당 경로의 컴포넌트를 찾고 그 컴포넌트만 보여주는 형식으로 해보면 될 것 같다.

여기서 children의 타입에 대한 궁금한 점이 생겼다. 기존에 prop으로 받는 children의 타입을 ReactNode로 지정해주었는데, 들어오는 객체의 타입은 ReactElement이다. 그리고 함수 컴포넌트의 리턴 타입은 JSX.Element이다. 이 세 타입의 관계에 대해 짚고 넘어가야겠다는 생각이 들었다.

[ReactNode, ReactElement, JSX.Element](docs/react-types.md)

Routes 컴포넌트의 children으로 Route 컴포넌트만 받을 수 있게 children 타입을 좁히는 방법을 생각해봤다. 우선 컴포넌트만 들어오기에 ReactElement를 사용하면 된다. 이전에는 as를 이용해 타입을 ReactElement의 prop 프로퍼티 값의 타입을 단언해 구현했지만, 제네릭에 타입을 지정해주어 RoutesChildren 타입을 선언하였다.

```tsx
interface RoutesChildren extends ReactElement<RouteProps, typeof Route> {}
interface RoutesProps {
  children: RoutesChildren | RoutesChildren[]
}
```

![refactor-routes](https://user-images.githubusercontent.com/78616893/194751123-e96e5f23-5ead-4d93-b29c-c05ed61b01b2.png)

<br>

### 2. useRouter popstate

위에서 구현했을 때 popstate 이벤트를 useRouter hook으로 이동시켰다. 하지만 이전에 구현한 방식에서는 모든 Route 컴포넌트들이 렌더링되고 있었고, 중복으로 이벤트가 실행되고 있었다. 따라서 문제가 없다고 느꼈다.

하지만 Route 컴포넌트를 하나만 렌더링되게 리팩토링 하고 보니 페이지에서 useRouter hook을 사용하고 있지 않다면 popstate 이벤트가 실행되지 않아 뒤로가기, 앞으로가기가 작동이 하지 않았다. 이를 다시 전체 페이지를 감싸는 Router로 옮겼다.

- Router: url 이동 감지(location 상태 관리), context provider
- Routes: 해당 페이지 Route 컴포넌트의 component prop 렌더링

---

Routes가 복수의 Route 컴포넌트를 가지거나 하나의 Route 컴포넌트만 가지고 있을 때 잘못된 경로로 이동했을 때 각각의 경우에 대한 처리가 필요해 보인다.

- 복수의 Route: RouteProps를 읽을 수 없어 에러가 발생한다.
- 단일 Route: children으로 보내 준 Route를 반환한다.
