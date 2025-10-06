import React from "react";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";


type User = {
  id: number;
  name: string;
  email: string;
};

const data: User[] = [
  { id: 1, name: "Juan Pérez", email: "juan@example.com" },
  { id: 2, name: "Ana Gómez", email: "ana@example.com" },
  { id: 3, name: "Luis Martínez", email: "luis@example.com" },
];

const columns: TableColumn<User>[] = [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "Nombre",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Correo",
    selector: (row) => row.email,
  },
];



const TableServices: React.FC = () => {
  return (
    <DataTable
      title="Usuarios"
      columns={columns}
      data={data}
      pagination
      highlightOnHover
      striped
    />
  );
}

export default TableServices