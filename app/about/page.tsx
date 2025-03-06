import React from "react";
import Link from "next/link";
import {
  Github,
  Twitter,
  Linkedin,
  Cpu,
  Code,
  Trophy,
  Rocket,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const About = async() => {
  return (
    <div className="container mx-auto py-12 px-4 flex flex-col gap-10">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">
            Hi there, I&apos;m Siddhesh! 👋
          </h1>
          <p className="text-xl text-zinc-400">
            Passionate developer, hackathon enthusiast, and problem solver
          </p>
        </div>

        {/* Journey Section */}
        <Card className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-indigo-400" />
              <CardTitle>My Journey</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-300">
              My tech journey began with a challenging mission: dual booting my
              laptop to Ubuntu. Despite encountering the dreaded &quot;dead screen
              with GRUB interface&quot; (after accidentally deleting Ubuntu OS from
              Windows!), I persevered. That experience ignited my passion for
              technology.
            </p>
            <p className="text-zinc-300">
              The true breakthrough came when I created my first AI chess game.
              Watching pieces move across the board, guided by logic I&apso;d
              written, was both thrilling and empowering—it completely hooked me
              on programming and set me on my current path.
            </p>
          </CardContent>
        </Card>

        {/* Hackathon Adventures */}
        <Card className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              <CardTitle>Hackathon Adventures</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-300">
              I love diving into hackathons to push my limits and test my
              skills. One particularly memorable competition stands out:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-300">
              <li>
                Worked{" "}
                <span className="font-semibold text-indigo-400">
                  18 hours straight
                </span>{" "}
                to qualify for the first round
              </li>
              <li>
                Stayed laser-focused through the second round and{" "}
                <span className="font-semibold text-indigo-400">
                  won the competition
                </span>
              </li>
              <li>
                The victory was so overwhelming that I was moved to tears—a
                moment I&apos;ll never forget
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-blue-400" />
            <h2 className="text-2xl font-bold">Tools & Technologies</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Languages</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-900/40 hover:bg-blue-900/60"
                >
                  JavaScript
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-900/40 hover:bg-blue-900/60"
                >
                  TypeScript
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-900/40 hover:bg-blue-900/60"
                >
                  C++
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Frameworks</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-900/40 hover:bg-blue-900/60"
                >
                  React
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-900/40 hover:bg-blue-900/60"
                >
                  Next.js
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Databases</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-900/40 hover:bg-blue-900/60"
                >
                  PostgreSQL
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-900/40 hover:bg-blue-900/60"
                >
                  SQLite
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-900/40 hover:bg-blue-900/60"
                >
                  MongoDB
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Other Tools</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-900/40 hover:bg-blue-900/60"
                >
                  Docker
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-900/40 hover:bg-blue-900/60"
                >
                  Git
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-900/40 hover:bg-blue-900/60"
                >
                  Prisma
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-900/40 hover:bg-blue-900/60"
                >
                  Vercel
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-900/40 hover:bg-blue-900/60"
                >
                  Tailwind CSS
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-900/40 hover:bg-blue-900/60"
                >
                  Shadcn
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Current Project */}
        <Card className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-green-400" />
              <CardTitle>Current Project</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-300">
              I&apos;m currently working on{" "}
              <span className="font-semibold text-indigo-400">code2tech</span>,
              an educational platform aimed at creating engaging and interactive
              learning experiences for children with less exposure to tech and
              education.
            </p>
            <div className="flex justify-start">
              <Link
                href="https://www.code2tech.net/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="flex items-center gap-2">
                  Visit code2tech
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Connect Section */}
        <div className="pt-6 border-t border-zinc-800">
          <h2 className="text-2xl font-bold mb-4">Let&apos;s Connect</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="https://x.com/the_demon_sid"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
            </Link>
            <Link
              href="https://www.linkedin.com/in/siddhesh-shrirame-b9427a257/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
            </Link>
            <Link
              href="https://bsky.app/profile/the-demon-sid.bsky.social"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                BlueSky
              </Button>
            </Link>
            <Link
              href="https://github.com/thedemonsid"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
