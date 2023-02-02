import { directive } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { Subscription } from 'rxjs'
import { getUser } from '../services/user.service'
import { noChange, nothing } from 'lit'

class WhenUserRole extends AsyncDirective {

	#subscription: Subscription = new Subscription()

	render<T, F>(roles: string[], trueCase: () => T, falseCase?: () => F) {
		if (this.isConnected) {
			this.#subscription = getUser().subscribe((user) => {
                if (user?.roles?.some((role: string) => roles.includes(role))) {
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
		this.#subscription.unsubscribe()
	}
}

export const whenUserRole = directive(WhenUserRole)
