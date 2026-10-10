import { Component, type ReactNode } from 'react';
/** A failed chunk or calculation must leave navigation and the saved notebook usable. */
export class LabBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <section className="notice" role="alert">
        <h2>Laboratoire indisponible</h2>
        <p>
          Un composant n’a pas pu se charger ou calculer. Votre carnet reste enregistré. Vérifiez le
          réseau si cette expérience n’a pas encore été mise en cache.
        </p>
        <button onClick={() => location.reload()}>Réessayer le chargement</button>{' '}
        <a href="#/laboratoire">Revenir aux instruments</a>
      </section>
    ) : (
      this.props.children
    );
  }
}
