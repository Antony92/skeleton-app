import { $user } from '@app/shared/auth';
import type { User } from '@app/types/user.type';
import { nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';

class WhenUser extends AsyncDirective {
  private unsubscribe?: () => void;
  private trueCase?: () => unknown;
  private falseCase?: () => unknown;

  render<T, F>(trueCase: () => T, falseCase?: () => F) {
    this.trueCase = trueCase;
    this.falseCase = falseCase;
    this.subscribe();
    return this.getValue($user.get());
  }

  override reconnected() {
    this.subscribe();
    this.setValue(this.getValue($user.get()));
  }

  override disconnected() {
    this.unsubscribe?.();
  }

  subscribe() {
    if (this.isConnected && !this.unsubscribe) {
      this.unsubscribe = $user.listen((user) => this.setValue(this.getValue(user)));
    }
  }

  getValue(user: User) {
    if (user && this.trueCase) {
      return this.trueCase();
    } else if (this.falseCase) {
      return this.falseCase();
    } else {
      return nothing;
    }
  }
}

export const whenUser = directive(WhenUser);
