import {Movement} from '@/types/movement';
import {
  buildReportCsv,
  computeFinanceSummary,
  formatCurrency,
} from '@/utils/report';

function buildMovement(overrides: Partial<Movement> = {}): Movement {
  return {
    id: 'm1',
    productId: 'p1',
    productName: 'Queijo Minas',
    category: 'cheese',
    type: 'sold',
    amount: '2',
    costPrice: '3',
    salePrice: '5',
    date: '2026-07-10T00:00:00.000Z',
    ...overrides,
  };
}

describe('buildReportCsv', () => {
  it('includes a header row and one row per movement', () => {
    const csv = buildReportCsv([buildMovement()]);
    const lines = csv.split('\n');

    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe(
      'Data,Produto,Categoria,Tipo,Quantidade,Custo unit.,Venda unit.',
    );
    expect(lines[1]).toContain('Queijo Minas');
    expect(lines[1]).toContain('Vendido');
  });

  it('labels lost movements in Portuguese', () => {
    const csv = buildReportCsv([buildMovement({type: 'lost'})]);
    expect(csv).toContain('Perdido');
  });

  it('escapes fields that contain commas', () => {
    const csv = buildReportCsv([
      buildMovement({productName: 'Queijo, tipo minas'}),
    ]);
    expect(csv).toContain('"Queijo, tipo minas"');
  });
});

describe('computeFinanceSummary', () => {
  it('accumulates revenue, cost and profit from sold movements', () => {
    const summary = computeFinanceSummary([
      buildMovement({
        type: 'sold',
        amount: '2',
        costPrice: '3',
        salePrice: '5',
      }),
    ]);

    expect(summary.revenue).toBe(10);
    expect(summary.cost).toBe(6);
    expect(summary.profit).toBe(4);
    expect(summary.soldCount).toBe(1);
    expect(summary.lostCount).toBe(0);
  });

  it('accumulates lost value from lost movements using cost price', () => {
    const summary = computeFinanceSummary([
      buildMovement({
        type: 'lost',
        amount: '3',
        costPrice: '4',
        salePrice: '9',
      }),
    ]);

    expect(summary.lostValue).toBe(12);
    expect(summary.lostCount).toBe(1);
    expect(summary.revenue).toBe(0);
  });

  it('treats missing prices as zero instead of NaN', () => {
    const summary = computeFinanceSummary([
      buildMovement({
        type: 'sold',
        amount: '5',
        costPrice: undefined,
        salePrice: undefined,
      }),
    ]);

    expect(summary.revenue).toBe(0);
    expect(summary.cost).toBe(0);
    expect(Number.isNaN(summary.profit)).toBe(false);
  });

  it('returns zeroed totals for an empty list', () => {
    expect(computeFinanceSummary([])).toEqual({
      revenue: 0,
      cost: 0,
      profit: 0,
      lostValue: 0,
      soldCount: 0,
      lostCount: 0,
    });
  });
});

describe('formatCurrency', () => {
  it('formats a number as Brazilian currency', () => {
    expect(formatCurrency(10)).toContain('10,00');
  });
});
