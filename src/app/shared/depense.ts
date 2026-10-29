export type Categorie = 'Alimentation' | 'Logement' | 'Transport' | 'Loisirs' | 'Études';

export interface Depense {
  id: string;        // généré par json-server (chaîne)
  libelle: string;
  montant: number;   // en euros
  date: string;      // format 'AAAA-MM-JJ'
  categorie: Categorie;
}

export const CATEGORIES: Categorie[] = ['Alimentation', 'Logement', 'Transport', 'Loisirs', 'Études'];