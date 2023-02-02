import { directive } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { Observable, Subscription } from 'rxjs'
import { noChange, nothing } from 'lit'

class Observe extends AsyncDirective {

	#subscription: Subscription = new Subscription()

	render(observable: Observable<unknown>) {
		if (this.isConnected) {
			this.#subscription = observable.subscribe((value) => value ? this.setValue(value) : this.setValue(nothing))
		}
		return noChange
	}

	disconnected() {
		this.#subscription.unsubscribe()
	}
}

export const observe = directive(Observe)
