import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DepenseCard } from './depense-card';

describe('DepenseCard', () => {
  it('affiche le libellé de la dépense', async () => {
    await TestBed.configureTestingModule({
      imports: [DepenseCard],
      providers: [provideRouter([])], // nécessaire à cause du routerLink
    }).compileComponents();

    const fixture = TestBed.createComponent(DepenseCard);
    fixture.componentRef.setInput('depense', {
      id: '1',
      libelle: 'Loyer',
      montant: 420,
      date: '2026-10-05',
      categorie: 'Logement',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Loyer');
  });
});