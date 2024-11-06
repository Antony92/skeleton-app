import { directive } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { Subscription } from 'rxjs'
import { getUserObservable } from '@app/shared/auth'
import { noChange, nothing } from 'lit'

class WhenUser extends AsyncDirective {

	private subscription: Subscription = new Subscription()

	render<T, F>(trueCase: () => T, falseCase?: () => F) {
		if (this.isConnected) {
			this.subscription = getUserObservable().subscribe((user) => {
                if (user) {
					this.setValue(trueCase())
				} else if (falseCase) {
					this.setValue(falseCase())
				} else {
					this.setValue(nothing)
				}
            })
		}
		return noChange
	}

	disconnected() {
		this.subscription.unsubscribe()
	}
}

export const whenUser = directive(WhenUser)
