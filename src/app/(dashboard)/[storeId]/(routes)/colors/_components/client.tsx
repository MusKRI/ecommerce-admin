"use client";
import { useRouter, useParams } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button/button";
import Heading from "@/components/ui/heading/heading";
import { Separator } from "@/components/ui/separator/separator";
import { ColorColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ApiList } from "@/components/ui/api-list/api-list";

type ColorClientProps = {
  data: ColorColumn[];
};

const ColorClient = ({ data }: ColorClientProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${data.length})`}
          description="Manage colors for your store"
        />

        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className="h-4 w-4 mr-2" />
          <span>Add New</span>
        </Button>
      </div>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API calls for Colors" />

      <Separator />

      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
};

export default ColorClient;
