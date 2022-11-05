import { directive } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { Subscription } from 'rxjs'
import { getUser } from '../services/user.service'
import { noChange, nothing, TemplateResult } from 'lit'

class WhenUserRole extends AsyncDirective {

	private subscription: Subscription | null = null

	override render(roles: string[] = [], trueCase: () => TemplateResult, falseCase?: () => TemplateResult) {
		if (this.isConnected) {
			this.subscription = getUser().subscribe((user) => {
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

	override disconnected() {
		this.subscription?.unsubscribe()
	}
}

export const whenUserRole = directive(WhenUserRole)
