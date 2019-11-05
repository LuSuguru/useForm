/// <reference types="react" />
declare type ActionState<State> = {
    [key in keyof State]?: any;
};
declare type ActionFunction<State> = (state: State) => ActionState<State>;
declare type Action<State> = ActionState<State> | ActionFunction<State>;
declare function stateReducer<State extends any>(state: State, newState: ActionState<State> | ActionFunction<State>): State;
export default function <State>(initialState: State, reducer?: typeof stateReducer): (State | import("react").Dispatch<Action<State>>)[];
export {};
