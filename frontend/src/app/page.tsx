'use client';

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Shield, Zap, Brain, Globe } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">IntelliColab</h1>
            </div>
            <div className="space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            AI-Powered Team 
            <span className="text-indigo-600"> Collaboration</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your team communication with our scalable, microservices-based chat platform. 
            Built for modern teams that value innovation, security, and real-time collaboration.
          </p>
          <div className="space-x-4">
            <Link href="/auth/register">
              <Button size="lg" className="px-8 py-3">
                Start Collaborating
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything Your Team Needs
            </h3>
            <p className="text-lg text-gray-600">
              Built on cutting-edge microservices architecture with enterprise-grade features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <MessageSquare className="h-12 w-12 text-indigo-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Real-time Chat</h4>
              <p className="text-gray-600">
                Instant messaging with room management, file sharing, and persistent message history.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-indigo-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Security</h4>
              <p className="text-gray-600">
                JWT-based authentication, rate limiting, and secure API gateway protecting all services.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-indigo-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Team Management</h4>
              <p className="text-gray-600">
                Organize teams, manage user roles, and create private or public collaboration spaces.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <Zap className="h-12 w-12 text-indigo-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">High Performance</h4>
              <p className="text-gray-600">
                Microservices architecture with Redis caching and Kafka messaging for scalability.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <Brain className="h-12 w-12 text-indigo-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">AI Integration</h4>
              <p className="text-gray-600">
                AI-powered features for smart suggestions, content analysis, and enhanced productivity.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <Globe className="h-12 w-12 text-indigo-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Full Observability</h4>
              <p className="text-gray-600">
                Comprehensive monitoring with Prometheus, Grafana dashboards, and centralized logging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Team Communication?
          </h3>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of teams already collaborating smarter with IntelliColab
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-6 w-6 text-indigo-400 mr-2" />
              <span className="text-white font-semibold">IntelliColab</span>
            </div>
            <p className="text-gray-400">
              © 2024 IntelliColab. Built with modern microservices architecture.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
