import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { Store } from 'nanostores';

export class StoreController<AtomType> implements ReactiveController {
  private unsubscribes?: (() => void)[];
  private host: ReactiveControllerHost;
  private atoms: Store<AtomType>[];

  constructor(host: ReactiveControllerHost, atoms: Store<AtomType>[]) {
    this.host = host;
    this.atoms = atoms;
    this.host.addController(this);
  }

  hostConnected() {
    this.unsubscribes = this.atoms.map((atom) => atom.subscribe(() => this.host.requestUpdate()));
  }

  hostDisconnected() {
    this.unsubscribes?.forEach((unsubscribe) => unsubscribe());
  }

  get values(): AtomType[] {
    return this.atoms.map((atom) => atom.get());
  }
}
