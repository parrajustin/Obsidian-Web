import type { Immutable, WritableDraft } from "immer";
import { castDraft, castImmutable, produce } from "immer";

type ListenerCallback<T> = (state: Immutable<T>) => void;
type AsyncListenerCallback<T> = (state: Immutable<T>) => Promise<void>;

type PrivateStateTag = { state: string };
export type StateTag<T extends string> = { state: T };
type PrivateActionTag = { action: string };
export type ActionTag<T extends string> = { action: T };
export type ReducerFunc<S extends PrivateStateTag, A extends PrivateActionTag> = (
  action: A,
  state: Readonly<S>
) => S;

/** Controller state. */
export class StateReducerController<
  StateT extends PrivateStateTag,
  ActionT extends PrivateActionTag,
  ReducerT extends ReducerFunc<StateT, ActionT> = ReducerFunc<StateT, ActionT>
> {
  private base_: StateT;
  /** Current state held. */
  private current_: Immutable<StateT>;
  /** Callbacks listeners waiting. */
  private callbacks_ = new Set<ListenerCallback<StateT>>();
  private asyncCallbacks_ = new Set<AsyncListenerCallback<StateT>>();
  /** If there is a micro task already scheduled. */
  private hasMicroTask_ = false;

  constructor(
    base: StateT,
    private reducerFunc_: ReducerT
  ) {
    this.base_ = base;
    this.current_ = castImmutable<StateT>(base);
  }

  public getCurrentState(): Immutable<StateT> {
    return this.current_;
  }

  /** Add a callback listener to the state. If `includeInitalValue` is true the current value will always be published. */
  public addListener(
    callback: ListenerCallback<StateT>,
    includeInitalValue = false
  ): StateReducerController<StateT, ActionT, ReducerT> {
    this.callbacks_.add(callback);
    if (includeInitalValue) {
      callback(this.current_);
    }
    return this;
  }

  public addAsyncListener(
    callback: AsyncListenerCallback<StateT>
  ): StateReducerController<StateT, ActionT, ReducerT> {
    this.asyncCallbacks_.add(callback);
    return this;
  }

  /** Remove a callback listener to the state. */
  public removeListner(
    callback: ListenerCallback<StateT>
  ): StateReducerController<StateT, ActionT, ReducerT> {
    this.callbacks_.delete(callback);
    return this;
  }

  /** Applies the change to the state. */
  private applyChange(
    changeFunc: (state: WritableDraft<StateT>) => WritableDraft<StateT> | void
  ): StateReducerController<StateT, ActionT, ReducerT> {
    const draft = castDraft(this.current_) as StateT;
    this.current_ = castImmutable(produce<StateT, WritableDraft<StateT>>(draft, changeFunc));

    if (!this.hasMicroTask_) {
      this.hasMicroTask_ = true;
      queueMicrotask(async () => {
        this.hasMicroTask_ = false;
        for (const cb of this.callbacks_) {
          cb(this.current_);
        }
        for (const asyncCB of this.asyncCallbacks_) {
          queueMicrotask(async () => {
            await asyncCB(this.current_);
          });
        }
      });
    }

    return this;
  }

  public applyAction(action: ActionT): StateReducerController<StateT, ActionT, ReducerT> {
    this.applyChange((draft: WritableDraft<StateT>) => {
      return this.reducerFunc_(action, draft as Readonly<StateT>) as WritableDraft<StateT>;
    });
    return this;
  }

  /** Reset to the original base. */
  public resetToBase(): StateReducerController<StateT, ActionT, ReducerT> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.applyChange((_draft: WritableDraft<StateT>): WritableDraft<StateT> => {
      return this.base_ as WritableDraft<StateT>;
    });
    return this;
  }
}
