"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, or } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import { MoreVertical, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { handleDeleteResume } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

type Paper = {
  id: string;
  url: string;
  hash: string;
  fileName: string;
  isDiscoverable?: boolean;
};

const fetchUploadedPapers = async () => {
  try {
    const collectionName = process.env.NEXT_PUBLIC_FIREBASE_COLLECTION_NAME || "default_collection_name";
    const q = query(
      collection(db, collectionName),
      or(
        where('isDiscoverable', '==', true),
        where('isDiscoverable', '==', null)
      )
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Paper[];
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return [];
  }
};

// New function to get total count of all resumes
const getTotalResumeCount = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'resumes'));
    return querySnapshot.size;
  } catch (error) {
    console.error("Error fetching total resume count:", error);
    return 0;
  }
};

export default function SearchPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchUploadedPapers().then(setPapers);
    getTotalResumeCount().then(setTotalCount);
  }, []);

  const handleDelete = async (hash: string) => {
    const deletionCode = prompt("Please enter the deletion code:");
    if (!deletionCode) return;

    try {
      await handleDeleteResume(hash, deletionCode);
      setPapers(papers.filter(paper => paper.hash !== hash));
      // Update total count after deletion
      getTotalResumeCount().then(setTotalCount);
      toast({
        title: "Success",
        description: "Resume deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete the resume.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <button className="bg-blue-200 text-black py-2 px-4 rounded-md hover:bg-blue-300 transition">
            Back
          </button>
        </Link>
      </div>

      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Statistics</DropdownMenuLabel>
            <DropdownMenuItem className="text-sm">
              Total Resumes: {totalCount}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm">
              Visible Resumes: {papers.length}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h1 className="text-3xl font-bold text-center text-slate-800">Resumes</h1>
      <div className="w-24 h-1 bg-blue-500 mt-2 mb-6"></div>

      <ul className="w-full max-w-md space-y-3">
        {papers.length > 0 ? (
          papers.map((paper) => (
            <li key={paper.id} className="relative group">
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 bg-white"
                      onClick={() => handleDelete(paper.hash)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link 
                href={'/'+ paper.hash} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block p-4 bg-white border rounded shadow hover:bg-gray-50 text-blue-600"
              >
                {paper.fileName || "Untitled Resume"}
              </Link>
            </li>
          ))
        ) : (
          <p className="text-gray-600 text-center">No resumes found.</p>
        )}
      </ul>
    </div>
  );
}