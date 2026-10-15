import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { Store } from 'nanostores';

export class StoreController<AtomType> implements ReactiveController {
  private unsubscribe?: () => void;
  private host: ReactiveControllerHost;
  private atom: Store<AtomType>;

  constructor(host: ReactiveControllerHost, atom: Store<AtomType>) {
    this.host = host;
    this.atom = atom;
    this.host.addController(this);
  }

  hostConnected() {
    this.unsubscribe = this.atom.subscribe(() => {
      this.host.requestUpdate();
    });
  }

  hostDisconnected() {
    this.unsubscribe?.();
  }

  get value(): AtomType {
    return this.atom.get();
  }
}
