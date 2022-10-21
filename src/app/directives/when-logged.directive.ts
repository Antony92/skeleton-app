import { directive } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { Subscription } from 'rxjs'
import { authState } from '../services/auth.service'
import { noChange, nothing, TemplateResult } from 'lit'

class WhenLogged extends AsyncDirective {

	private subscription: Subscription | null = null

	render(trueCase: () => TemplateResult, falseCase?: () => TemplateResult) {
		if (this.isConnected) {
			this.subscription = authState.subscribe((state) => {
                if (state) this.setValue(trueCase())
                else if (falseCase) this.setValue(falseCase())
                else this.setValue(nothing)
            })
		}
		return noChange
	}

	override disconnected() {
		this.subscription?.unsubscribe()
	}
}

export const whenLogged = directive(WhenLogged)
