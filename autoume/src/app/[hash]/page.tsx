import { Metadata } from 'next';
import { db } from '../../lib/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';
import Link from 'next/link';
import { ActionMenu } from './ActionMenu';
import { Logo } from './Logo';

async function getResumeData(hash: string) {
  try {
    const collectionName = process.env.NEXT_PUBLIC_FIREBASE_COLLECTION_NAME || "default_collection_name";
    
    const resumesRef = collection(db, collectionName);
    const q = query(resumesRef, where('hash', '==', hash));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      url: doc.data().url,
      fileName: doc.data().fileName,
      createdAt: doc.data().createdAt,
    };
  } catch (error) {
    console.error('Error fetching resume:', error);
    return null;
  }
}

type Params = Promise<{hash: string}>

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const params = await props.params;
  const hash = params.hash;
  return {
    title: hash ? 'View Resume | Hireme.pls' : 'Welcome to Hireme.pls',
    description: 'Easily share and view professional resumes online',
  };
}

export default async function ResumePage(props: { params: Params }) {
  const params = await props.params;
  const hash = params.hash;
  const resumeData = await getResumeData(hash);

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-2 sm:p-4">
        <div className="container max-w-4xl mx-auto">
          <header className="py-3 sm:py-6 mb-4 sm:mb-8">
            <Logo />
          </header>
          
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl font-semibold text-red-500">Resume Not Found</CardTitle>
              <CardDescription className="text-sm sm:text-base text-slate-600 mt-2">
                The resume you&apos;re looking for might have been removed or the link is incorrect.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-4 sm:pb-6">
              <Link href="/upload">
                <Button variant="outline" className="text-sm sm:text-base border-slate-200 hover:border-slate-300 hover:bg-slate-50">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Resume
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-0 sm:p-4">
      <div className="container max-w-5xl mx-auto">
        <header className="py-3 sm:py-6 mb-4 sm:mb-8">
          <Logo />
        </header>
        
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm relative">
          <ActionMenu url={resumeData.url} hash={hash} />
          <CardHeader className="border-b border-slate-100 p-3 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <CardDescription className="text-xs sm:text-sm text-slate-500">
                Uploaded {new Date(resumeData.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <iframe
              src={resumeData.url}
              className="w-full h-[800px] border-0"
              title="Resume Preview"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}