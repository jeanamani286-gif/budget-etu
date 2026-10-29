import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DepensesService } from '../../core/depenses';
import { CATEGORIES } from '../../shared/depense';

@Component({
  selector: 'app-stats',
  imports: [CurrencyPipe],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats {
  service = inject(DepensesService);
  budget = this.service.budgetMensuel;

  // Mois en cours, par exemple '2026-10'
  mois = new Date().toISOString().slice(0, 7);

  // Les dépenses du mois en cours
  depensesDuMois = computed(() => {
    const liste = this.service.depenses.value() ?? [];
    const resultat = [];
    for (const d of liste) {
      if (d.date.startsWith(this.mois)) {
        resultat.push(d);
      }
    }
    return resultat;
  });

  // Total dépensé
  totalDepense = computed(() => {
    let total = 0;
    for (const d of this.depensesDuMois()) {
      total = total + d.montant;
    }
    return total;
  });

  // Reste à dépenser
  reste = computed(() => this.budget() - this.totalDepense());

  // Vrai si le budget est dépassé
  depasse = computed(() => this.totalDepense() > this.budget());

  // Part du budget consommée (entre 0 et 100)
  pourcentage = computed(() => {
    if (this.budget() <= 0) {
      return 100;
    }
    const p = (this.totalDepense() / this.budget()) * 100;
    if (p > 100) {
      return 100;
    }
    return p;
  });

  // Total et part de chaque catégorie
  totauxCategories = computed(() => {
    const resultat = [];
    for (const cat of CATEGORIES) {
      let somme = 0;
      for (const d of this.depensesDuMois()) {
        if (d.categorie === cat) {
          somme = somme + d.montant;
        }
      }
      let pourcent = 0;
      if (this.totalDepense() > 0) {
        pourcent = (somme / this.totalDepense()) * 100;
      }
      resultat.push({ nom: cat, somme: somme, pourcent: pourcent });
    }
    return resultat;
  });

  // Catégorie la plus coûteuse
  categorieTop = computed(() => {
    let meilleure = '';
    let max = 0;
    for (const c of this.totauxCategories()) {
      if (c.somme > max) {
        max = c.somme;
        meilleure = c.nom;
      }
    }
    return meilleure;
  });

  changerBudget(event: Event) {
    const champ = event.target as HTMLInputElement;
    this.budget.set(Number(champ.value));
  }
}