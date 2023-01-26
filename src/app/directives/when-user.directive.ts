import { directive } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { Subscription } from 'rxjs'
import { getUser } from '../services/user.service'
import { noChange, nothing, TemplateResult } from 'lit'

class WhenUser extends AsyncDirective {

	#subscription: Subscription = new Subscription()

	render(trueCase: () => TemplateResult, falseCase?: () => TemplateResult) {
		if (this.isConnected) {
			this.#subscription = getUser().subscribe((user) => {
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
		this.#subscription.unsubscribe()
	}
}

export const whenUser = directive(WhenUser)
