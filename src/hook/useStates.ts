import { Dispatch, Reducer, useCallback, useReducer } from 'react'

type ActionFunction<State> = (state: State) => Partial<State>

type Action<State> = Partial<State> | ActionFunction<State>
type StatesHook<State> = [State, Dispatch<Action<State>>, () => void]

function stateReducer<State>(state: State, newState: Action<State>): State {
  if (typeof newState === 'function') {
    newState = newState(state)
  }

  return { ...state, ...newState }
}

export default function <State extends object>(
  initialState: State,
  reducer = stateReducer,
): StatesHook<State> {
  const [state, setState] = useReducer<Reducer<State, Action<State>>>(
    reducer,
    initialState,
  )

  const onReset = useCallback(() => {
    setState(initialState)
  }, [])

  return [state, setState, onReset]
}

