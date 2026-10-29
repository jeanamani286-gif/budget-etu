import { Component, inject, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DepensesService } from '../../core/depenses';
import { Depense } from '../../shared/depense';
import { BadgeCategorie } from '../../shared/badge-categorie/badge-categorie';

@Component({
  selector: 'app-depense-detail',
  imports: [RouterLink, CurrencyPipe, DatePipe, BadgeCategorie],
  templateUrl: './depense-detail.html',
  styleUrl: './depense-detail.css',
})
export class DepenseDetail {
  private service = inject(DepensesService);
  private router = inject(Router);

  // L'id vient de l'URL (grâce à withComponentInputBinding)
  id = input.required<string>();

  depense = httpResource<Depense>(() => 'http://localhost:3000/depenses/' + this.id());

  supprimer(d: Depense) {
    const ok = confirm('Supprimer « ' + d.libelle + ' » ?');
    if (!ok) {
      return;
    }

    this.service.supprimer(d.id).subscribe(() => {
      this.service.depenses.reload();
      this.router.navigate(['/depenses']);
    });
  }
}