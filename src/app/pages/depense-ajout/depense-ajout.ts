import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, required, minLength, min, validate } from '@angular/forms/signals';
import { DepensesService } from '../../core/depenses';
import { CATEGORIES, Categorie } from '../../shared/depense';

@Component({
  selector: 'app-depense-ajout',
  imports: [FormField],
  templateUrl: './depense-ajout.html',
  styleUrl: './depense-ajout.css',
})
export class DepenseAjout {
  private service = inject(DepensesService);
  private router = inject(Router);

  categories = CATEGORIES;

  // Les données du formulaire
  model = signal({
    libelle: '',
    montant: 0,
    date: '',
    categorie: '',
  });

  // Le formulaire et ses règles de validation
  f = form(this.model, (p) => {
    required(p.libelle, { message: 'Le libellé est obligatoire.' });
    minLength(p.libelle, 2, { message: '2 caractères minimum.' });

    required(p.montant, { message: 'Le montant est obligatoire.' });
    min(p.montant, 0.01, { message: 'Le montant doit être au moins 0,01 €.' });

    required(p.date, { message: 'La date est obligatoire.' });
    // Refuse une date dans le futur (les dates AAAA-MM-JJ se comparent comme du texte)
    validate(p.date, (contexte) => {
      const aujourdhui = new Date().toISOString().slice(0, 10);
      if (contexte.value() > aujourdhui) {
        return { kind: 'futur', message: 'La date ne peut pas être dans le futur.' };
      }
      return null;
    });

    required(p.categorie, { message: 'La catégorie est obligatoire.' });
  });

  enregistrer() {
    if (this.f().invalid()) {
      return;
    }

    const v = this.model();
    const nouvelle = {
      libelle: v.libelle,
      montant: v.montant,
      date: v.date,
      categorie: v.categorie as Categorie,
    };

    this.service.ajouter(nouvelle).subscribe(() => {
      this.service.depenses.reload();
      this.router.navigate(['/depenses']);
    });
  }
}