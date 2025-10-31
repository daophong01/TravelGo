// src/components/Table.tsx
import { ReactNode } from 'react';

type Props = {
  headers: string[];
  children: ReactNode;
};

export default function Table({ headers, children }: Props) {
  return (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((h) => (
              <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}