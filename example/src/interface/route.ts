export interface Route {
  path: string
  name?: string
  component: any
  childrenRoutes?: Route[]
}
