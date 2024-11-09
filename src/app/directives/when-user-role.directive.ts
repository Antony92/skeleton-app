import { directive } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { Subscription } from 'rxjs'
import { getUserObservable } from '@app/shared/auth'
import { noChange, nothing } from 'lit'

class WhenUserRole extends AsyncDirective {

	private subscription: Subscription = new Subscription()

	render<T, F>(roles: string[], trueCase: () => T, falseCase?: () => F) {
		if (this.isConnected) {
			this.subscription = getUserObservable().subscribe((user) => {
                if (user?.roles.some((role) => roles.includes(role))) {
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

export const whenUserRole = directive(WhenUserRole)
