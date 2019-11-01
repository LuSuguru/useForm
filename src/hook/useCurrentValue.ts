import { useRef } from 'react'

function useCurrentValue<T>(value: T) {
  const ref = useRef(null)
  ref.current = value

  return ref
}

export default useCurrentValue
