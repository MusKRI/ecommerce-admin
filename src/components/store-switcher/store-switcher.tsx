"use client";

import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Store as StoreIcon,
  ChevronsUpDown,
  Check,
  PlusCircle,
} from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Button } from "../ui/button/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

const StoreSwitcher = ({ className, items = [] }: StoreSwitcherProps) => {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId
  );

  const [open, setOpen] = useState(false);

  const onStoreSelect = (store: (typeof formattedItems)[number]) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a store"
            className={cn("justify-between w-[200px]", className)}
          >
            <StoreIcon className="w-4 h-4 mr-2" />
            <span>{currentStore?.label}</span>
            <ChevronsUpDown className="w-4 h-4 ml-auto shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search store" />
              <CommandEmpty>No store found</CommandEmpty>
              <CommandGroup heading="Stores">
                {formattedItems.map((store) => {
                  return (
                    <CommandItem
                      key={store.value}
                      onSelect={() => onStoreSelect(store)}
                      className="text-sm cursor-pointer"
                    >
                      <StoreIcon className="w-4 h-4 mr-2" />
                      <span>{store.label}</span>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          currentStore?.value === store.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>

            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    storeModal.onOpen();
                  }}
                  className="cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  <span>Create Store</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default StoreSwitcher;
