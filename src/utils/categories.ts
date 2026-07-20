export type Category = {
  key: string;
  name: string;
  color: string;
};

export const categories: Category[] = [
  {key: 'cheese', name: 'Queijo', color: '#5636D3'},
  {key: 'yogurt', name: 'Iogurte', color: '#FF872C'},
  {key: 'fermentedmilk', name: 'Leite Fermentado', color: '#12A454'},
  {key: 'butter', name: 'Manteiga', color: '#E83F5B'},
  {key: 'milkcream', name: 'Creme de Leite', color: '#26195C'},
  {key: 'condensedmilk', name: 'Leite Condensado', color: '#9C001A'},
  {key: 'creamcheese', name: 'Requeijão', color: '#5036D3'},
  {key: 'icecream', name: 'Sorvete', color: '#4636D3'},
  {key: 'others', name: 'Outros', color: '#2636D3'},
];

export type CategoryKey = (typeof categories)[number]['key'];

export function getCategory(key: string): Category {
  return (
    categories.find(category => category.key === key) ??
    categories[categories.length - 1]
  );
}
