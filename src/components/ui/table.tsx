import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  isHeader?: boolean;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  isHeader?: boolean;
}

export const Table: React.FC<TableProps> = ({ children, className = '' }) => (
  <div className="w-full overflow-x-auto border border-gray-200 dark:border-dark-300 rounded-lg">
    <table className={`w-full border-collapse ${className}`}>{children}</table>
  </div>
);

export const TableHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-gray-100 dark:bg-dark-400 border-b border-gray-200 dark:border-dark-300">
    {children}
  </thead>
);

export const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody className="divide-y divide-gray-200 dark:divide-dark-300">{children}</tbody>
);

export const TableRow: React.FC<TableRowProps> = ({ children, className = '', isHeader = false }) => (
  <tr
    className={`${
      isHeader ? 'bg-gray-100 dark:bg-dark-400' : 'hover:bg-gray-50 dark:hover:bg-dark-400/50'
    } transition-colors duration-200 ${className}`}
  >
    {children}
  </tr>
);

export const TableCell: React.FC<TableCellProps> = ({
  children,
  className = '',
  align = 'left',
  isHeader = false,
}) => {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

  if (isHeader) {
    return (
      <th
        className={`px-6 py-3 font-semibold text-gray-900 dark:text-white text-sm ${alignClass} ${className}`}
      >
        {children}
      </th>
    );
  }

  return (
    <td className={`px-6 py-4 text-sm text-gray-900 dark:text-gray-100 ${alignClass} ${className}`}>
      {children}
    </td>
  );
};
