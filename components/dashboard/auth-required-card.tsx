import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthRequiredCard() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Sign In Required</CardTitle>
          <CardDescription className="text-center">
            Please sign in to view your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Link href="/login">
            <Button>Go to Sign In</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
