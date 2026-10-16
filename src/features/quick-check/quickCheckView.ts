export function renderQuickCheck(root: HTMLElement): void {
  root.innerHTML = `
    <main class="qc">
      <header class="qc-header">
        <h1>Quick Check</h1>
        <p class="qc-lead">Is your available time different from what you planned today?</p>
      </header>

      <form class="qc-card" novalidate>
        <div class="qc-field">
          <label for="planned-minutes">Planned Time (minutes)</label>
          <input id="planned-minutes" type="number" inputmode="numeric"
                 min="0" max="1440" aria-describedby="planned-hint" />
          <p id="planned-hint" class="qc-hint">How much time you originally planned to spend today</p>
        </div>

        <div class="qc-field">
          <label for="available-minutes">Available Time Today (minutes)</label>
          <input id="available-minutes" type="number" inputmode="numeric"
                 min="0" max="1440" aria-describedby="available-hint" />
          <p id="available-hint" class="qc-hint">How much time you actually have after unexpected tasks</p>
        </div>
      </form>

      <section class="qc-result" aria-live="polite">
        <p>Enter your time to see how you can plan your day.</p>
      </section>
    </main>
  `;
}