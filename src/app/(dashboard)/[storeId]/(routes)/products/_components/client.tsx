"use client";
import { useRouter, useParams } from "next/navigation";

import { Button } from "@/components/ui/button/button";
import Heading from "@/components/ui/heading/heading";
import { Separator } from "@/components/ui/separator/separator";
import { Plus } from "lucide-react";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ApiList } from "@/components/ui/api-list/api-list";

type ProductClientProps = {
  data: ProductColumn[];
};

const ProductClient = ({ data }: ProductClientProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage products for your store"
        />

        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="h-4 w-4 mr-2" />
          <span>Add New</span>
        </Button>
      </div>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API calls for Products" />

      <Separator />

      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};

export default ProductClient;
