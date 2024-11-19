import { RowData } from "duckdb";

const typeMapping = {
  VARCHAR: "string",
  DOUBLE: "number",
  BOOLEAN: "boolean",
  BIGINT: "number", // In JavaScript, all numbers are of type 'number'
  TIMESTAMP: "Date", // Date objects in JavaScript
  unknown: "unknown",
} as const;

type TypeMappingValues = (typeof typeMapping)[keyof typeof typeMapping];

type FieldData = {
  name: string;
  type: TypeMappingValues;
  table_name: string;
};

type DuckDBType = keyof typeof typeMapping;

function mapDuckDBTypesToJavaScript(type: DuckDBType): TypeMappingValues {
  return typeMapping[type] || typeMapping.unknown;
}

export function transformRowDataToFieldData(rowData: RowData): FieldData {
  return {
    name: rowData.column_name,
    type: mapDuckDBTypesToJavaScript(rowData.data_type),
    table_name: rowData.table_name,
  };
}

export function groupByTableName(rows: RowData[]) {
  const groupedRows = rows.reduce((acc, row) => {
    const tableName = row.table_name;
    if (!acc[tableName]) {
      acc[tableName] = [];
    }
    acc[tableName].push(row);
    return acc;
  }, {} as Record<string, RowData[]>);

  return groupedRows;
}
