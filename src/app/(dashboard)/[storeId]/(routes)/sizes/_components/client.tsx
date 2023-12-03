"use client";
import { useRouter, useParams } from "next/navigation";

import { Button } from "@/components/ui/button/button";
import Heading from "@/components/ui/heading/heading";
import { Separator } from "@/components/ui/separator/separator";
import { Plus } from "lucide-react";
import { SizeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ApiList } from "@/components/ui/api-list/api-list";

type SizeClientProps = {
  data: SizeColumn[];
};

const SizeClient = ({ data }: SizeClientProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage sizes for your store"
        />

        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className="h-4 w-4 mr-2" />
          <span>Add New</span>
        </Button>
      </div>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API calls for Sizes" />

      <Separator />

      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
};

export default SizeClient;
