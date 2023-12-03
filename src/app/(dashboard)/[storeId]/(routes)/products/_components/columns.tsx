"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  size: string;
  category: string;
  color: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const originData = row.original as ProductColumn & {
        featuredImage: {
          url: string;
        };
      };
      return (
        <div className="flex flex-row items-center gap-x-2">
          <div className="relative w-12 h-12 overflow-hidden rounded">
            <Image
              fill
              alt="Featured Image"
              src={originData.featuredImage.url}
              className="object-cover"
            />
          </div>
          <span className="truncate max-w-[280px]">{originData.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          <span>{row.original.color}</span>
          <div
            className="h-6 w-6 rounded-full border"
            style={{ backgroundColor: row.original.color }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
