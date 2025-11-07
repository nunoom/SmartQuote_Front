/**
 * Utilitários para exportação de dados
 */

/**
 * Exporta dados para CSV
 * @param data Array de objetos para exportar
 * @param filename Nome do arquivo (sem extensão)
 * @param options Opções de exportação
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  options?: {
    /** Incluir BOM UTF-8 para melhor compatibilidade com Excel */
    includeBOM?: boolean;
    /** Transformar valores antes da exportação */
    transformer?: (row: T) => Record<string, any>;
  }
): void {
  if (!data || data.length === 0) {
    throw new Error('Nenhum dado para exportar');
  }

  // Aplicar transformação se fornecida
  const transformedData = options?.transformer 
    ? data.map(options.transformer)
    : data;

  // Criar CSV
  const headers = Object.keys(transformedData[0]).join(',');
  const rows = transformedData.map((row) => 
    Object.values(row).map(value => {
      // Converter para string e escapar vírgulas, aspas e quebras de linha
      const stringValue = String(value ?? '-');
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',')
  );

  // Adicionar BOM UTF-8 se solicitado (recomendado para Excel)
  const BOM = options?.includeBOM !== false ? '\uFEFF' : '';
  const csv = BOM + [headers, ...rows].join('\n');

  // Criar e baixar arquivo
  downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Exporta dados para JSON
 * @param data Dados para exportar
 * @param filename Nome do arquivo (sem extensão)
 * @param pretty Formatar JSON de forma legível
 */
export function exportToJSON<T>(
  data: T,
  filename: string,
  pretty: boolean = true
): void {
  const json = pretty 
    ? JSON.stringify(data, null, 2)
    : JSON.stringify(data);

  downloadFile(json, `${filename}.json`, 'application/json;charset=utf-8;');
}

/**
 * Faz download de um arquivo
 * @param content Conteúdo do arquivo
 * @param filename Nome do arquivo
 * @param mimeType Tipo MIME
 */
function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Gera nome de arquivo com timestamp
 * @param prefix Prefixo do arquivo
 * @param extension Extensão do arquivo (com ponto)
 */
export function generateTimestampedFilename(
  prefix: string,
  extension: string = '.csv'
): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${prefix}-${timestamp}${extension}`;
}

/**
 * Formata data para exportação
 * @param date Data para formatar
 * @param locale Locale para formatação
 */
export function formatDateForExport(
  date: Date | string,
  locale: string = 'pt-AO'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '-';
  }

  return dateObj.toLocaleString(locale, {
    dateStyle: 'short',
    timeStyle: 'short'
  });
}

/**
 * Sanitiza texto para CSV (remove quebras de linha e caracteres especiais)
 * @param text Texto para sanitizar
 */
export function sanitizeForCSV(text: string): string {
  if (!text) return '';
  return text
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .replace(/\t/g, ' ')
    .trim();
}
