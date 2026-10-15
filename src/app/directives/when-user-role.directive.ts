import { $user } from '@app/shared/auth';
import { noChange, nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';

class WhenUserRole extends AsyncDirective {
  private unsubscribe?: () => void;

  render<T, F>(roles: string[], trueCase: () => T, falseCase?: () => F) {
    if (this.isConnected && !this.unsubscribe) {
      this.unsubscribe = $user.subscribe((user) => {
        if (user?.roles.some((role) => roles.includes(role))) {
          this.setValue(trueCase());
        } else if (falseCase) {
          this.setValue(falseCase());
        } else {
          this.setValue(nothing);
        }
      });
    }
    return noChange;
  }

  disconnected() {
    this.unsubscribe?.();
  }
}

export const whenUserRole = directive(WhenUserRole);
