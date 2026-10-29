import { Routes } from '@angular/router';
import { DepenseList } from './pages/depense-list/depense-list';
import { DepenseAjout } from './pages/depense-ajout/depense-ajout';
import { DepenseDetail } from './pages/depense-detail/depense-detail';
import { DepenseModifier } from './pages/depense-modifier/depense-modifier';
import { PageIntrouvable } from './pages/page-introuvable/page-introuvable';

export const routes: Routes = [
  { path: '', redirectTo: 'depenses', pathMatch: 'full' },
  { path: 'depenses', component: DepenseList },
  { path: 'depenses/nouvelle', component: DepenseAjout }, // avant ':id'
  { path: 'depenses/:id', component: DepenseDetail },
  { path: 'depenses/:id/modifier', component: DepenseModifier },
  {
    path: 'stats',
    loadComponent: () => import('./pages/stats/stats').then((m) => m.Stats),
  },
  { path: '**', component: PageIntrouvable },
];