import { ReactElement, ReactNode, useContext } from 'react'

import LocationContext from '../contexts/LocationContext'
import { RouteProps } from './Route'

const findRouteComponent = (node: ReactElement, location: string) => {
  const { path } = node.props as RouteProps
  return path === location
}

const getRouteComponent = (node: ReactElement) => {
  const { component } = node.props as RouteProps
  return component
}

interface Props {
  children: ReactElement | ReactElement[]
}

function Routes({ children }: Props) {
  const { location } = useContext(LocationContext)

  const isChildrenArray = Array.isArray(children)

  const getToRenderComponent = () => {
    if (isChildrenArray) {
      const foundedNode = children.find((element) =>
        findRouteComponent(element, location)
      )

      return getRouteComponent(foundedNode as ReactElement)
    }

    return getRouteComponent(children)
  }

  const resultComponent = getToRenderComponent()

  return resultComponent
}

export default Routes
