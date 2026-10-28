import type { AppSystemMessage } from '@app/elements/system-message/app-system-message.element';
import { html, render } from 'lit';

/**
 * Show system message
 * @param message
 * @param type
 */
export const systemMessage = async (
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
) => {
  await import('@app/elements/system-message/app-system-message.element');

  // Hide existing systemMessage
  document.querySelector<AppSystemMessage>('app-system-message#system-message')?.remove();

  // Create systemMessage
  const systemMessage = Object.assign(document.createElement('app-system-message'), {
    id: 'system-message',
    level,
  });
  systemMessage.addEventListener('app-after-close', () => systemMessage?.remove());

  // Set up state
  const template = html`${message}`;

  // Render
  render(template, systemMessage);

  // Add to DOM
  document.body.appendChild(systemMessage);

  return systemMessage.show();
};
