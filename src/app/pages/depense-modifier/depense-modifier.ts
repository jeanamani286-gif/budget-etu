import { Component, effect, inject, input, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import { form, FormField, required, minLength, min } from '@angular/forms/signals';
import { DepensesService } from '../../core/depenses';
import { CATEGORIES, Categorie, Depense } from '../../shared/depense';

@Component({
  selector: 'app-depense-modifier',
  imports: [FormField],
  templateUrl: './depense-modifier.html',
  styleUrl: './depense-modifier.css',
})
export class DepenseModifier {
  private service = inject(DepensesService);
  private router = inject(Router);

  // L'id vient de l'URL
  id = input.required<string>();
  categories = CATEGORIES;

  depense = httpResource<Depense>(() => 'http://localhost:3000/depenses/' + this.id());

  model = signal({
    libelle: '',
    montant: 0,
    date: '',
    categorie: '',
  });

  f = form(this.model, (p) => {
    required(p.libelle, { message: 'Le libellé est obligatoire.' });
    minLength(p.libelle, 2, { message: '2 caractères minimum.' });
    required(p.montant, { message: 'Le montant est obligatoire.' });
    min(p.montant, 0.01, { message: 'Le montant doit être au moins 0,01 €.' });
    required(p.date, { message: 'La date est obligatoire.' });
    required(p.categorie, { message: 'La catégorie est obligatoire.' });
  });

  constructor() {
    // Dès que la dépense est chargée, on préremplit le formulaire
    effect(() => {
      const d = this.depense.value();
      if (d) {
        this.model.set({
          libelle: d.libelle,
          montant: d.montant,
          date: d.date,
          categorie: d.categorie,
        });
      }
    });
  }

  enregistrer() {
    if (this.f().invalid()) {
      return;
    }

    const v = this.model();
    const modifiee = {
      libelle: v.libelle,
      montant: v.montant,
      date: v.date,
      categorie: v.categorie as Categorie,
    };

    this.service.modifier(this.id(), modifiee).subscribe(() => {
      this.service.depenses.reload();
      this.router.navigate(['/depenses', this.id()]);
    });
  }
}