// Copy-to-clipboard with a text-swap confirmation and a Clipboard API
// fallback (select the text and ask for Ctrl+C). docs/design-spec.md §5.4.
const button = document.getElementById('copy-email-btn') as HTMLButtonElement | null;
const status = document.getElementById('copy-email-status');
const label = button?.querySelector('span');

if (button && label && status) {
  const email = button.dataset.email ?? '';
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  const showCopied = () => {
    label.textContent = 'Copied';
    status.textContent = 'Email address copied';
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      label.textContent = 'Copy';
    }, 2000);
  };

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      showCopied();
    } catch {
      // Fallback: select the email text near the button so the user can
      // copy it manually, and announce how.
      const range = document.createRange();
      const emailLink = document.querySelector(`a[href="mailto:${email}"]`);
      if (emailLink) {
        range.selectNodeContents(emailLink);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      status.textContent = 'Press Ctrl+C to copy';
    }
  });
}

export {};
