import React from 'react';
import { Shield, Database, Cpu, User, Network, Layers, Box } from 'lucide-react';

interface ServiceIconProps {
  category: string;
  className?: string;
  isRed?: boolean;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ category, className = 'w-5 h-5', isRed = false }) => {
  const strokeColor = isRed ? '#EF4444' : '#18181B';

  switch (category) {
    case 'VPC':
      // 3D Isometric Cube / Wireframe Box
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
          <path d="M12 12l8-4.5" />
          <path d="M12 12v9" />
          <path d="M12 12L4 7.5" />
        </svg>
      );
    case 'EC2':
      // Shield / Hexagon
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'ECS':
      // 3D Container Cube
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      );
    case 'RDS':
      // Cylinder Database
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      );
    case 'Lambda':
      // Lambda λ Glyph
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M6 19l4.5-9" />
          <path d="M18 19l-7.5-14H7" />
        </svg>
      );
    case 'S3':
      // S3 Storage Bucket
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 6h16l-2 14H6L4 6z" />
          <path d="M4 6c0 1.1 3.58 2 8 2s8-.9 8-2" />
        </svg>
      );
    case 'IAM':
      // User Profile
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="7" r="4" />
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        </svg>
      );
    default:
      // Network nodes
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="5" r="3" />
          <circle cx="6" cy="19" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M12 8v3l-4.5 5" />
          <path d="M12 11l4.5 5" />
        </svg>
      );
  }
};
