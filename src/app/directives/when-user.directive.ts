import { directive } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { noChange, nothing } from 'lit'
import { computed, Signal } from '@lit-labs/signals'
import { getUser } from '@app/shared/auth'

class WhenUser extends AsyncDirective {
	private watcher: Signal.subtle.Watcher | null = null
	private $user = computed(() => getUser())

	private notify<T, F>(trueCase: () => T, falseCase?: () => F) {
    const user = getUser()
		if (user) {
			this.setValue(trueCase())
		} else if (falseCase) {
			this.setValue(falseCase())
		} else {
			this.setValue(nothing)
		}
	}

	render<T, F>(trueCase: () => T, falseCase?: () => F) {
		if (this.isConnected) {
			this.watcher = new Signal.subtle.Watcher(() => this.notify(trueCase, falseCase))
      this.watcher.watch(this.$user)
			this.notify(trueCase, falseCase)
		}
		return noChange
	}

	disconnected() {
		this.watcher?.unwatch(this.$user)
	}
}

export const whenUser = directive(WhenUser)
