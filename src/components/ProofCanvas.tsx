'use client';

import React, { useEffect, useRef } from 'react';

interface ProofCanvasProps {
  imageSrc: string;
  widthInches: number;
  heightInches: number;
  hasHeading: boolean;
  grommetCount: number;
}

export default function ProofCanvas({
  imageSrc,
  widthInches,
  heightInches,
  hasHeading,
  grommetCount,
}: ProofCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      const margin = 100;
      const maxDimension = 650;
      const scale = Math.min(
        maxDimension / widthInches,
        maxDimension / heightInches
      );

      const flagW = widthInches * scale;
      const flagH = heightInches * scale;
      const headingW = hasHeading ? 35 : 0;

      canvas.width = flagW + margin * 2 + headingW;
      canvas.height = flagH + margin * 2;

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const startX = margin + headingW;
      const startY = margin;

      // Draw Flag Artwork
      ctx.drawImage(img, startX, startY, flagW, flagH);

      // Outer Border
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.strokeRect(startX, startY, flagW, flagH);

      // 1. Stitching Notes (Top/Bottom 2 rows, Fly End 4 rows)
      ctx.strokeStyle = '#dc2626';
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 1.5;

      // Top Edge (2 Rows)
      [4, 9].forEach((offset) => {
        ctx.beginPath();
        ctx.moveTo(startX, startY + offset);
        ctx.lineTo(startX + flagW, startY + offset);
        ctx.stroke();
      });

      // Bottom Edge (2 Rows)
      [4, 9].forEach((offset) => {
        ctx.beginPath();
        ctx.moveTo(startX, startY + offset);
        ctx.lineTo(startX + flagW, startY + offset);
        ctx.stroke();
      });

      // Fly End / Right Edge (4 Rows)
      [4, 9, 14, 19].forEach((offset) => {
        ctx.beginPath();
        ctx.moveTo(startX + flagW - offset, startY);
        ctx.lineTo(startX + flagW - offset, startY + flagH);
        ctx.stroke();
      });

      ctx.setLineDash([]);

      // 2. Left Hoist Heading & Grommets
      if (hasHeading) {
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(startX - headingW, startY, headingW, flagH);
        ctx.strokeStyle = '#94a3b8';
        ctx.strokeRect(startX - headingW, startY, headingW, flagH);

        const grommetX = startX - headingW / 2;
        const step = grommetCount > 1 ? flagH / (grommetCount - 1) : flagH / 2;

        for (let i = 0; i < grommetCount; i++) {
          const grommetY = grommetCount === 1 ? startY + flagH / 2 : startY + i * step;

          ctx.beginPath();
          ctx.arc(grommetX, grommetY, 7, 0, Math.PI * 2);
          ctx.fillStyle = '#d97706';
          ctx.fill();
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(grommetX, grommetY, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }
      }

      // 3. Labels
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`FINISHED SIZE: ${widthInches}" W x ${heightInches}" H`, startX, startY - 25);

      ctx.fillStyle = '#dc2626';
      ctx.fillText(`-- 1/4" Stitching: 2 Rows Top/Bottom | 4 Rows Fly End`, startX, startY + flagH + 25);

      if (hasHeading) {
        ctx.fillStyle = '#475569';
        ctx.fillText(`HOIST SIDE (${grommetCount} Grommets)`, startX - headingW, startY - 10);
      }
    };
  }, [imageSrc, widthInches, heightInches, hasHeading, grommetCount]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} className="border border-slate-200 shadow-sm rounded-lg bg-white max-w-full" />
    </div>
  );
}
