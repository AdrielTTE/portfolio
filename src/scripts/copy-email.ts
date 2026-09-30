// Copy-to-clipboard with a label crossfade and a Clipboard API fallback
// (select the text and ask for Ctrl+C). docs/design-spec.md §5.4. Wires every
// .copy-email on the page, so two instances never share ids or state.
const HOLD = 1600;

document.querySelectorAll<HTMLElement>('.copy-email').forEach((root) => {
  const button = root.querySelector<HTMLButtonElement>('.copy-button');
  const status = root.querySelector<HTMLElement>('.copy-status');
  if (!button || !status) return;
  const email = button.dataset.email ?? '';
  let resetTimer: ReturnType<typeof setTimeout> | undefined;
  let announceTimer: ReturnType<typeof setTimeout> | undefined;

  // Clear, then write on the next tick: a live region only speaks on change,
  // so a second copy with the same text would otherwise stay silent.
  const announce = (text: string) => {
    clearTimeout(announceTimer);
    status.textContent = '';
    announceTimer = setTimeout(() => {
      status.textContent = text;
    }, 60);
  };

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      button.classList.add('is-copied');
      announce('Email address copied');
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        button.classList.remove('is-copied');
        status.textContent = '';
      }, HOLD);
    } catch {
      // Fallback: select the email text on the page so the user can copy it
      // manually, and say how; with no visible address, read it out instead.
      const emailLink = document.querySelector(`a[href="mailto:${email}"]`);
      if (emailLink) {
        const range = document.createRange();
        range.selectNodeContents(emailLink);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        announce('Email selected. Press Ctrl+C to copy');
      } else {
        announce(`Copy failed. The address is ${email}`);
      }
    }
  });
});

export {};
