"use client";

import Heading from "@/components/ui/heading/heading";
import { Separator } from "@/components/ui/separator/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table/data-table";

type OrderClientProps = {
  data: OrderColumn[];
};

const OrderClient = ({ data }: OrderClientProps) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orderes for your store"
      />

      <Separator />

      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
};

export default OrderClient;
