import {File, Paths} from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import {Movement} from '@/types/movement';
import {getCategory} from '@/utils/categories';
import {formatISODate} from '@/utils/date';

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

export function buildReportCsv(movements: Movement[]): string {
  const header = [
    'Data',
    'Produto',
    'Categoria',
    'Tipo',
    'Quantidade',
    'Custo unit.',
    'Venda unit.',
  ];

  const rows = movements.map(movement => [
    formatISODate(movement.date.slice(0, 10)),
    movement.productName,
    getCategory(movement.category).name,
    movement.type === 'sold' ? 'Vendido' : 'Perdido',
    movement.amount,
    movement.costPrice ?? '',
    movement.salePrice ?? '',
  ]);

  return [header, ...rows]
    .map(row => row.map(escapeCsvField).join(','))
    .join('\n');
}

export interface FinanceSummary {
  revenue: number;
  cost: number;
  profit: number;
  lostValue: number;
  soldCount: number;
  lostCount: number;
}

export function computeFinanceSummary(movements: Movement[]): FinanceSummary {
  return movements.reduce<FinanceSummary>(
    (summary, movement) => {
      const amount = Number(movement.amount) || 0;
      const unitCost = Number(movement.costPrice) || 0;
      const unitSale = Number(movement.salePrice) || 0;

      if (movement.type === 'sold') {
        return {
          ...summary,
          revenue: summary.revenue + unitSale * amount,
          cost: summary.cost + unitCost * amount,
          profit: summary.profit + (unitSale - unitCost) * amount,
          soldCount: summary.soldCount + 1,
        };
      }

      return {
        ...summary,
        lostValue: summary.lostValue + unitCost * amount,
        lostCount: summary.lostCount + 1,
      };
    },
    {revenue: 0, cost: 0, profit: 0, lostValue: 0, soldCount: 0, lostCount: 0},
  );
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export async function exportReport(
  movements: Movement[],
  monthLabel: string,
): Promise<void> {
  const csv = buildReportCsv(movements);
  const file = new File(Paths.cache, `controllac-relatorio-${monthLabel}.csv`);

  file.create({overwrite: true});
  file.write(csv);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'text/csv',
      dialogTitle: 'Exportar relatório do Controllac',
    });
  }
}
