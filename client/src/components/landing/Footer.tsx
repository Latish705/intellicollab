import React from 'react';
import { IntelliCollabLogo } from '../icons';

const Footer: React.FC = () => (
    <footer className="py-16 bg-dark-bg border-t border-dark-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2">
                        <IntelliCollabLogo className="w-8 h-8" />
                        <span className="text-xl font-bold text-white">IntelliCollab</span>
                    </div>
                    <p className="mt-4 text-gray-400 max-w-xs">The future of team collaboration, powered by AI and built for scale.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-white">Product</h4>
                    <ul className="mt-4 space-y-2 text-gray-400">
                        <li><a href="#features" className="hover:text-white">Features</a></li>
                        <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                        <li><a href="#demo" className="hover:text-white">Demo</a></li>
                        <li><a href="#" className="hover:text-white">API</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-white">Company</h4>
                    <ul className="mt-4 space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white">About</a></li>
                        <li><a href="#" className="hover:text-white">Blog</a></li>
                        <li><a href="#" className="hover:text-white">Careers</a></li>
                        <li><a href="#" className="hover:text-white">Contact</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-white">Support</h4>
                    <ul className="mt-4 space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white">Help Center</a></li>
                        <li><a href="#" className="hover:text-white">Documentation</a></li>
                        <li><a href="#" className="hover:text-white">Status</a></li>
                        <li><a href="#" className="hover:text-white">Security</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-16 pt-8 border-t border-dark-border flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
                <p>&copy; 2024 IntelliCollab. All rights reserved. Built with cutting-edge microservices architecture.</p>
                <div className="flex gap-4 mt-4 sm:mt-0">
                    <a href="#" className="hover:text-white">Privacy Policy</a>
                    <a href="#" className="hover:text-white">Terms of Service</a>
                    <a href="#" className="hover:text-white">Cookies</a>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;