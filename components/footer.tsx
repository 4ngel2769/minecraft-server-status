'use client';

import Link from 'next/link';
import { Server, Github, Twitter, Mail, Heart, Code2 } from 'lucide-react';
import { motion } from 'motion/react';

export function Footer() {
  const currentYear = new Date().getFullYear();

const footerLinks = {
    product: [
      { label: 'Home', href: '/' },
      { label: 'MOTD Editor', href: '/motd-editor' },
      { label: 'Documentation', href: '/docs' },
    ],
    resources: [
      { label: 'GitHub Repository', href: 'https://github.com/4ngel2769/minecraft-server-status', external: true },
      { label: 'Report Issues', href: 'https://github.com/4ngel2769/minecraft-server-status/issues', external: true },
      { label: 'Contribute', href: 'https://github.com/4ngel2769/minecraft-server-status/pulls', external: true },
    ],
    legal: [
      { label: 'MIT License', href: 'https://github.com/4ngel2769/minecraft-server-status/blob/main/LICENSE', external: true },
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/4ngel2769', label: 'GitHub' },
    { icon: Twitter, href: 'https://x.com/4ngel2769', label: 'Twitter' },
    { icon: Mail, href: 'mailto:mcsrv@angellabs.xyz', label: 'Email' },
  ];

  return (
    <footer className="relative border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Gradient decoration */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <Server className="w-6 h-6 text-primary relative z-10" />
              </motion.div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                MC Status
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Monitor any Minecraft server in real-time. Check player counts, server status, and create custom MOTDs.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-full bg-accent hover:bg-accent/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} MC Status. Built with{' '}
              <Heart className="w-3 h-3 inline-block text-red-500 animate-pulse" />{' '}
              by{' '}
              <a
                href="https://github.com/4ngel2769"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-foreground transition-colors"
              >
                4ngel2769
              </a>
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Code2 className="w-3 h-3" />
              <span>Open Source • MIT</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
