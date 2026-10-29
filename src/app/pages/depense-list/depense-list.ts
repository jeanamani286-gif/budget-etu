import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DepensesService } from '../../core/depenses';
import { DepenseCard } from '../../shared/depense-card/depense-card';
import { CATEGORIES } from '../../shared/depense';

@Component({
  selector: 'app-depense-list',
  imports: [DepenseCard, CurrencyPipe],
  templateUrl: './depense-list.html',
  styleUrl: './depense-list.css',
})
export class DepenseList {
  private service = inject(DepensesService);
  ressource = this.service.depenses;

  categories = CATEGORIES;

  // Les filtres
  mois = signal('2026-10');
  categorie = signal(''); // '' = toutes les catégories
  recherche = signal('');

  // Tri : de la plus récente à la plus ancienne (on trie une copie)
  depensesTriees = computed(() => {
    const liste = this.ressource.value() ?? [];
    return [...liste].sort((a, b) => b.date.localeCompare(a.date));
  });

  // On garde seulement ce qui correspond aux trois filtres
  depensesFiltrees = computed(() => {
    const texte = this.recherche().toLowerCase();
    const resultat = [];
    for (const d of this.depensesTriees()) {
      const bonMois = d.date.startsWith(this.mois());
      const bonneCategorie = this.categorie() === '' || d.categorie === this.categorie();
      const bonLibelle = d.libelle.toLowerCase().includes(texte);
      if (bonMois && bonneCategorie && bonLibelle) {
        resultat.push(d);
      }
    }
    return resultat;
  });

  // Total des dépenses affichées
  total = computed(() => {
    let somme = 0;
    for (const d of this.depensesFiltrees()) {
      somme = somme + d.montant;
    }
    return somme;
  });

  changerMois(event: Event) {
    const champ = event.target as HTMLInputElement;
    this.mois.set(champ.value);
  }

  changerCategorie(event: Event) {
    const champ = event.target as HTMLSelectElement;
    this.categorie.set(champ.value);
  }

  changerRecherche(event: Event) {
    const champ = event.target as HTMLInputElement;
    this.recherche.set(champ.value);
  }
}