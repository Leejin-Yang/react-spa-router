# React Type

## 1) ReactNode

```tsx
type ReactText = string | number
type ReactChild = ReactElement | ReactText

interface ReactNodeArray extends Array<ReactNode> {}
type ReactFragment = {} | ReactNodeArray

type ReactNode =
  | ReactChild
  | ReactFragment
  | ReactPortal
  | boolean
  | null
  | undefined
```

ReactNode 타입은 jsx 내에서 사용할 수 있는 모든 요소의 타입을 의미한다. ReactElement 타입은 아래에서 다루고 다른 타입들을 보면 다음과 같다.

- ReactFragments: 여러 개의 element
- ReactPortal: 별도의 DOM 하위 트리에 자식 element
- ReactText: DOM 상에서 텍스트 노드

<br>

## 2) ReactElement

type, props, key 프로퍼티 키를 가진 객체의 제네릭이다.

```tsx
type Key = string | number

interface ReactElement<
  P = any,
  T extends string | JSXElementConstructor<any> =
    | string
    | JSXElementConstructor<any>
> {
  type: T
  props: P
  key: Key | null
}
```

React.createElement 함수를 통해 생성된 컴포넌트만을 허용하는 타입이다. 평소 React에서 작성하는 JSX 코드는 이 React.createElement를 사용하는 형태로 변환된다. 알게 모르게 이 함수를 사용하고 있는 것이다.

```tsx
React.createElement(type, [props], [...children])
```

여기서 type 인자로 HTML 태그나 React 컴포넌트 또는 React Fragment가 올 수 있다. 위에 ReactElement 타입에서 보이는 type과 props 프로퍼티 키를 볼 수 있다.

```tsx
function App() {
	return (
		<Container>Hello World</Container>
	)
}

interface Props {
	children: React.ReactElement
}

function Container({children}: Props) {
	return (
		<div>{children)</div>
	)
}
```

따라서 children의 타입을 ReactElement라 했을 때, 위와 같이 Hello World와 같은 문자열을 children으로 넘겨 줄 수 없다.

**_오직 React.createElement 함수를 통해 생성된 컴포넌트만!!_**

<br>

## 3) JSX.Element

```tsx
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
  }
}
```

ReactElement에서 type과 props의 타입을 any로 선언한 ReactElement이다.
