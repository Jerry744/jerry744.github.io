// Progressive enhancement: every stage remains readable if JavaScript is unavailable.
document.querySelectorAll('[data-understanding-loop]').forEach((loop) => {
  const selector = loop.querySelector('.loop-selectors');
  const tabs = [...loop.querySelectorAll('[data-loop-step]')];
  const panels = [...loop.querySelectorAll('[data-loop-panel]')];
  if (!selector || !tabs.length || tabs.length !== panels.length) return;
  selector.setAttribute('role', 'tablist');
  tabs.forEach((tab) => tab.setAttribute('role', 'tab'));
  panels.forEach((panel) => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('tabindex', '0');
  });
  const select = (index, focus = false) => {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    if (focus) tabs[index].focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      select(next, true);
    });
  });
  select(0);
});
