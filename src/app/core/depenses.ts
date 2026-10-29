import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Depense } from '../shared/depense';

const URL = 'http://localhost:3000/depenses';

@Injectable({ providedIn: 'root' })
export class DepensesService {
  private http = inject(HttpClient);

  // La liste de toutes les dépenses (chargée depuis l'API)
  depenses = httpResource<Depense[]>(() => URL);

  // Le budget du mois, 700 € au départ
  budgetMensuel = signal(700);

  constructor() {
    // Au démarrage : on relit le budget sauvegardé
    const sauvegarde = localStorage.getItem('budget');
    if (sauvegarde !== null) {
      this.budgetMensuel.set(Number(sauvegarde));
    }

    // Dès que le budget change : on le sauvegarde
    effect(() => {
      localStorage.setItem('budget', String(this.budgetMensuel()));
    });
  }

  // Omit<Depense, 'id'> = une dépense sans id (json-server le crée)
  ajouter(depense: Omit<Depense, 'id'>) {
    return this.http.post<Depense>(URL, depense);
  }

  modifier(id: string, depense: Omit<Depense, 'id'>) {
    return this.http.patch<Depense>(URL + '/' + id, depense);
  }

  supprimer(id: string) {
    return this.http.delete(URL + '/' + id);
  }
}