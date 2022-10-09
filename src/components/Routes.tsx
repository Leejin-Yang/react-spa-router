import { ReactElement, useContext } from 'react'

import LocationContext from '../contexts/LocationContext'
import Route from './Route'
import type { RouteProps } from './Route'

interface RoutesChildren extends ReactElement<RouteProps, typeof Route> {}

const findRouteComponent = (node: RoutesChildren, location: string) => {
  const { path } = node.props
  return path === location
}

const getRouteComponent = (node: RoutesChildren) => {
  const { component } = node.props
  return component
}

interface Props {
  children: RoutesChildren | RoutesChildren[]
}

function Routes({ children }: Props) {
  const { location } = useContext(LocationContext)

  const isChildrenArray = Array.isArray(children)

  const getToRenderComponent = () => {
    if (isChildrenArray) {
      const foundedNode = children.find((element) =>
        findRouteComponent(element, location)
      )

      return getRouteComponent(foundedNode as RoutesChildren)
    }

    return getRouteComponent(children)
  }

  const resultComponent = getToRenderComponent()

  return resultComponent
}

export default Routes
