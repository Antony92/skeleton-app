import { directive } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { Observable, Subscription } from 'rxjs'
import { noChange } from 'lit'

class Observe extends AsyncDirective {

	private subscription: Subscription = new Subscription()

	render(observable: Observable<unknown>, result: (value: unknown) => unknown) {
		if (this.isConnected) {
			this.subscription = observable.subscribe((value) => this.setValue(result(value)))
		}
		return noChange
	}

	disconnected() {
		this.subscription.unsubscribe()
	}
}

export const observe = directive(Observe)
