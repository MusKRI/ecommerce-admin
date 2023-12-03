"use client";
import { useRouter, useParams } from "next/navigation";

import { Button } from "@/components/ui/button/button";
import Heading from "@/components/ui/heading/heading";
import { Separator } from "@/components/ui/separator/separator";
import { Plus } from "lucide-react";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ApiList } from "@/components/ui/api-list/api-list";

type BillboardClientProps = {
  data: BillboardColumn[];
};

const BillboardClient = ({ data }: BillboardClientProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage billboards for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>Add New</span>
        </Button>
      </div>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="label" />

      <Heading title="API" description="API calls for Billboards" />

      <Separator />

      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  );
};

export default BillboardClient;
