import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Stats } from './stats';
import { DepensesService } from '../../core/depenses';

describe('Stats', () => {
  const mois = new Date().toISOString().slice(0, 7);

  // Un faux service avec 3 dépenses, dont une très ancienne
  const fauxService = {
    depenses: {
      value: () => [
        { id: '1', libelle: 'Loyer', montant: 400, date: mois + '-05', categorie: 'Logement' },
        { id: '2', libelle: 'Courses', montant: 50, date: mois + '-10', categorie: 'Alimentation' },
        { id: '3', libelle: 'Ancien', montant: 100, date: '2000-01-01', categorie: 'Loisirs' },
      ],
    },
    budgetMensuel: signal(500),
  };

  beforeEach(async () => {
    fauxService.budgetMensuel.set(500);
    await TestBed.configureTestingModule({
      imports: [Stats],
      providers: [{ provide: DepensesService, useValue: fauxService }],
    }).compileComponents();
  });

  it('calcule le total du mois (sans la dépense ancienne)', () => {
    const fixture = TestBed.createComponent(Stats);
    expect(fixture.componentInstance.totalDepense()).toBe(450);
    expect(fixture.componentInstance.reste()).toBe(50);
  });

  it('signale un dépassement de budget', () => {
    const fixture = TestBed.createComponent(Stats);
    fauxService.budgetMensuel.set(300);
    expect(fixture.componentInstance.depasse()).toBe(true);
  });
});