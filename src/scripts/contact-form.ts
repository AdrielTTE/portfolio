// Progressive-enhancement contact form: works as a plain POST without this
// script; with it, submits via fetch and shows inline states.
// docs/design-spec.md §5.4.
const form = document.getElementById('contact-form') as HTMLFormElement | null;

if (form) {
  const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  const submitLabel = submitButton?.querySelector('span');
  const formError = document.getElementById('form-error');
  const fields = ['name', 'email', 'message'] as const;

  const fieldEl = (name: (typeof fields)[number]) =>
    form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;

  const errorFor = (name: (typeof fields)[number]) => document.getElementById(`cf-${name}-error`);

  function markTouched(name: (typeof fields)[number]) {
    const el = fieldEl(name);
    const err = errorFor(name);
    if (!el || !err) return;
    el.dataset.touched = 'true';
    const invalid = !el.checkValidity();
    err.hidden = !invalid;
    el.setAttribute('aria-invalid', invalid ? 'true' : 'false');
  }

  for (const name of fields) {
    const el = fieldEl(name);
    el?.addEventListener('blur', () => markTouched(name));
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (formError) formError.hidden = true;

    let firstInvalid: HTMLElement | null = null;
    for (const name of fields) {
      markTouched(name);
      const el = fieldEl(name);
      if (el && !el.checkValidity() && !firstInvalid) firstInvalid = el;
    }
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    form.setAttribute('aria-busy', 'true');
    if (submitButton) submitButton.disabled = true;
    if (submitLabel) submitLabel.textContent = 'Sending…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });

      if (response.ok) {
        const heading = document.createElement('h2');
        heading.className = 'success-heading';
        heading.tabIndex = -1;
        heading.textContent = "Message sent. I'll get back to you soon.";
        form.replaceWith(heading);
        heading.focus();
      } else {
        throw new Error('Formspree error');
      }
    } catch {
      if (formError) {
        formError.textContent = 'Something went wrong. Try WhatsApp or email instead.';
        formError.hidden = false;
      }
      form.removeAttribute('aria-busy');
      if (submitButton) submitButton.disabled = false;
      if (submitLabel) submitLabel.textContent = 'Send message';
    }
  });
}

export {};
