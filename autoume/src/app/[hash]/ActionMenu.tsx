'use client'

import { Button } from "@/components/ui/button";
import { Menu, Upload, Trash2 } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleDeleteResume } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface ActionMenuProps {
  hash: string;
  url: string;
}

export const ActionMenu = ({ hash, url }: ActionMenuProps) => {
  const handleDelete = async () => {
    const deletionCode = prompt("Please enter the deletion code:");
    if (!deletionCode) return;

    try {
      await handleDeleteResume(hash, deletionCode);
      toast({
        title: "Success",
        description: "Resume deleted successfully.",
      });
      // Optionally redirect to homepage after successful deletion
      window.location.href = '/';
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete the resume at" + url,
      });
    }
  };

  return (
    <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Menu className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='bg-white' align="end">
          <DropdownMenuItem asChild>
            <Link href="/upload" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Upload New Resume
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete this Resume
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};