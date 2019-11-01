import { Reducer, useCallback, useReducer } from 'react'

type ActionState<State> = { [key in keyof State]?: any }
type ActionFunction<State> = (state: State) => ActionState<State>
type Action<State> = ActionState<State> | ActionFunction<State>

function stateReducer<State>(state: State, newState: ActionState<State> | ActionFunction<State>): State {
  if (typeof newState === 'function') {
    newState = newState(state)
  }

  return { ...state, ...newState }
}

export default function <State>(initialState: State, reducer = stateReducer) {
  const [state, setState] = useReducer<Reducer<State, Action<State>>>(reducer, initialState)

  const onReset = useCallback(() => {
    setState(initialState)
  }, [])

  return [state, setState, onReset]
}
