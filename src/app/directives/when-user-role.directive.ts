import { directive } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { getUser } from '@app/shared/auth'
import { noChange, nothing } from 'lit'
import { Signal, computed } from '@lit-labs/signals'

class WhenUserRole extends AsyncDirective {
	private watcher: Signal.subtle.Watcher | null = null
	private $user = computed(() => getUser())

	private notify<T, F>(roles: string[], trueCase: () => T, falseCase?: () => F) {
    const user = getUser()
		if (user && user.roles.some((role) => roles.includes(role))) {
			this.setValue(trueCase())
		} else if (falseCase) {
			this.setValue(falseCase())
		} else {
			this.setValue(nothing)
		}
	}

	render<T, F>(roles: string[], trueCase: () => T, falseCase?: () => F) {
		if (this.isConnected) {
			this.watcher = new Signal.subtle.Watcher(() => this.notify(roles, trueCase, falseCase))
      this.watcher.watch(this.$user)
			this.notify(roles, trueCase, falseCase)
		}
		return noChange
	}

	disconnected() {
		this.watcher?.unwatch(this.$user)
	}
}

export const whenUserRole = directive(WhenUserRole)
