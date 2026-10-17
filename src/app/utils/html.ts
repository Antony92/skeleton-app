// inline style import
// import styles from '@app/styles/test.css?inline'
// static styles = [unsafeCSS(styles), css``]

// document.body.appendChild(element)
// adoptStyles(element.shadowRoot!, [...element.shadowRoot!.adoptedStyleSheets, css`dialog { background: red !important }`])

/**
 * Escape string from all html specific tags
 * @param html - The string to escape
 * @returns The escaped HTML string
 */
export const escapeHtml = (html: string) => {
  if (!html) return '';

  return html
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/`(.*?)`/g, '<code>$1</code>');
};

/**
 * Set page title based on app config + provided title
 * @param title - The specific page title to append
 */
export const setPageTitle = (title: string) => {
  document.title = `${import.meta.env.VITE_APP_TITLE} - ${title}`;
};

/**
 * Transform html form to object
 * @param form - The HTMLFormElement to serialize
 * @returns A plain object containing form key-value pairs
 */
export const serializeForm = (form: HTMLFormElement) => {
  return Object.fromEntries(new FormData(form).entries());
};

/**
 * Creates a debounced version of a function that delays its execution
 * @param func - The function to debounce
 * @param timeout - The delay in milliseconds (defaults to 300ms)
 * @returns The debounced function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(func: T, timeout = 300) => {
  let timer: number;
  return (...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), timeout);
  };
};

/**
 * Copies the provided text to the system clipboard
 * @param text - The string to copy
 * @returns A promise that resolves when the text is successfully copied
 */
export const copyToClipboard = (text: string) => {
  return navigator.clipboard.writeText(text);
};
