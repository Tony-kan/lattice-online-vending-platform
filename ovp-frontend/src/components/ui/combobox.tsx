"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define the shape of the props our Combobox will accept
interface ComboboxProps {
  items: {
    value: string;
    label: string;
  }[];
  onSelect: (value: string) => void;
  placeholder: string;
  searchPlaceholder?: string;
  notFoundMessage?: string;
}

export function Combobox({
  items,
  onSelect,
  placeholder,
  searchPlaceholder = "Search...",
  notFoundMessage = "No item found.",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");

  // Handler for when an item is selected from the list
  const handleSelect = (currentValue: string) => {
    const value = currentValue === selectedValue ? "" : currentValue;
    setSelectedValue(value);
    setOpen(false); // Close the popover on selection
    onSelect(value); // Call the parent component's onSelect handler
  };

  // Find the label of the currently selected item to display on the button
  const displayLabel = items.find(
    (item) => item.value === selectedValue
  )?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedValue ? displayLabel : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{notFoundMessage}</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={handleSelect}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedValue === item.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
