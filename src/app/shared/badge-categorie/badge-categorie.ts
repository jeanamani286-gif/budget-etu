import { Component, input } from '@angular/core';
import { Categorie } from '../depense';

@Component({
  selector: 'app-badge-categorie',
  templateUrl: './badge-categorie.html',
  styleUrl: './badge-categorie.css',
})
export class BadgeCategorie {
  categorie = input.required<Categorie>();
}