// pages/api/certificate.js (WITH QR CODE)
// Generates certificate PDF with QR code for verification

import { createClient } from '@supabase/supabase-js';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { ADVANCED_COURSES } from '../../lib/allyCourseData';

// QR Code generator (simple base64 SVG)
function generateQRCode(data) {
  // Use a public QR code API to generate the QR code
  // This returns the QR code as a URL string
  const encoded = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`;
}

function makeCertificateId(userId, courseId, issuedAt) {
  const hash = crypto
    .createHash('sha256')
    .update(`${userId}:${courseId}:${issuedAt}`)
    .digest('hex')
    .toUpperCase();
  const date = new Date(issuedAt);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `SH-${y}-${m}-${d}-${hash.slice(0, 4)}-${hash.slice(4, 8)}`;
}

export default async function handler(req, res) {
  const { courseId, token } = req.query;

  if (!courseId || !token) {
    return res.status(400).json({ error: 'Missing courseId or token' });
  }

  const course = ADVANCED_COURSES.find((c) => c.id === courseId);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const user = userData.user;

  const { data: cert, error: certError } = await supabase
    .from('certificates')
    .select('final_score, issued_at, certificate_id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .maybeSingle();

  if (certError || !cert) {
    return res.status(403).json({ error: 'No certificate found for this course' });
  }

  const recipientName =
    user.user_metadata?.full_name || user.email || 'SafeHaven Learner';
  const issuedDateObj = new Date(cert.issued_at);
  const issuedDate = issuedDateObj.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Use existing certificate_id or generate new one
  const certificateId = cert.certificate_id || makeCertificateId(user.id, courseId, cert.issued_at);

  // ========== STORE CERTIFICATE IN DATABASE ==========
  if (!cert.certificate_id) {
    const { error: updateError } = await supabase
      .from('certificates')
      .update({ certificate_id: certificateId })
      .eq('user_id', user.id)
      .eq('course_id', courseId);

    if (updateError) {
      console.error('Failed to store certificate ID:', updateError);
    }
  }

  // ========== GENERATE QR CODE URL ==========
  const verifyUrl = `https://safehaven.org/certificates/verify?id=${certificateId}`;
  const qrCodeUrl = generateQRCode(verifyUrl);

  let pdfBytes;
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 landscape
    const { width, height } = page.getSize();

    const serif = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const serifItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
    const serifBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const sans = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const sansBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let signatureImage = null;
    let signatureWidth = 0;
    let signatureHeight = 0;
    try {
      const signatureBytes = fs.readFileSync(
        path.join(process.cwd(), 'public', 'signature-lina.png')
      );
      signatureImage = await pdfDoc.embedPng(signatureBytes);
      signatureWidth = 230;
      signatureHeight = signatureWidth * (signatureImage.height / signatureImage.width);
    } catch (sigErr) {
      console.error('Signature image not found, continuing without it:', sigErr.message);
    }

    const rose = rgb(0.83, 0.09, 0.4);
    const roseDeep = rgb(0.56, 0.06, 0.28);
    const plum = rgb(0.29, 0.11, 0.31);
    const ink = rgb(0.13, 0.13, 0.15);
    const muted = rgb(0.42, 0.42, 0.45);
    const blush = rgb(0.99, 0.9, 0.94);
    const sand = rgb(0.93, 0.85, 0.89);
    const white = rgb(1, 1, 1);

    // Outer thin border + corner brackets
    page.drawRectangle({
      x: 20,
      y: 20,
      width: width - 40,
      height: height - 40,
      borderColor: sand,
      borderWidth: 1,
    });
    const bracket = (x, y, dx, dy) => {
      page.drawLine({ start: { x, y }, end: { x: x + dx, y }, thickness: 1.5, color: rose });
      page.drawLine({ start: { x, y }, end: { x, y: y + dy }, thickness: 1.5, color: rose });
    };
    bracket(28, height - 28, 14, -14);
    bracket(width - 28, height - 28, -14, -14);
    bracket(28, 28, 14, 14);
    bracket(width - 28, 28, -14, 14);

    // ---------- Left content column ----------
    const leftX = 70;
    const contentWidth = 620;

    // Logo mark: small heart path + wordmark
    page.drawSvgPath(
      'M12 21c-4-3-10-7-10-13 a5 5 0 0 1 10-2 a5 5 0 0 1 10 2c0 6-6 10-10 13z',
      { x: leftX, y: height - 90, scale: 1.3, color: rose }
    );
    page.drawText('SafeHaven', {
      x: leftX + 45,
      y: height - 82,
      size: 22,
      font: sansBold,
      color: plum,
    });
    page.drawText('Building a world free from GBV', {
      x: leftX + 45,
      y: height - 100,
      size: 9,
      font: sans,
      color: rose,
    });

    let cursorY = height - 165;

    page.drawText('This certifies that', {
      x: leftX,
      y: cursorY,
      size: 13,
      font: serifItalic,
      color: muted,
    });

    cursorY -= 48;
    page.drawText(recipientName, {
      x: leftX,
      y: cursorY,
      size: 34,
      font: serifBold,
      color: ink,
    });

    cursorY -= 32;
    page.drawText('has successfully completed the course', {
      x: leftX,
      y: cursorY,
      size: 12,
      font: serifItalic,
      color: muted,
    });

    cursorY -= 42;
    page.drawText(course.title, {
      x: leftX,
      y: cursorY,
      size: 26,
      font: sansBold,
      color: rose,
    });

    cursorY -= 26;
    page.drawText(course.subtitle, {
      x: leftX,
      y: cursorY,
      size: 12,
      font: sans,
      color: muted,
      maxWidth: contentWidth,
    });

    cursorY -= 32;
    const scoreText = `Final assessment score: ${cert.final_score}/5`;
    page.drawText(scoreText, { x: leftX, y: cursorY, size: 11, font: sans, color: ink });
    const scoreWidth = sans.widthOfTextAtSize(scoreText, 11);
    page.drawText('•', { x: leftX + scoreWidth + 12, y: cursorY, size: 11, font: sans, color: rose });
    page.drawText(`Issued ${issuedDate}`, {
      x: leftX + scoreWidth + 24,
      y: cursorY,
      size: 11,
      font: sans,
      color: ink,
    });

    // Signature block
    cursorY -= 70;
    const signatureLineY = cursorY - 10;
    if (signatureImage) {
      page.drawImage(signatureImage, {
        x: leftX,
        y: signatureLineY + 6,
        width: signatureWidth,
        height: signatureHeight,
      });
    }
    cursorY -= 10;
    page.drawLine({
      start: { x: leftX, y: cursorY },
      end: { x: leftX + 220, y: cursorY },
      thickness: 1,
      color: sand,
    });
    cursorY -= 18;
    page.drawText('L. Mtshatsha', {
      x: leftX,
      y: cursorY,
      size: 11,
      font: sansBold,
      color: rose,
    });
    cursorY -= 15;
    page.drawText('Head of Learning Hub and Certificate', { x: leftX, y: cursorY, size: 10, font: sans, color: ink });
    cursorY -= 14;
    page.drawText('SafeHaven', { x: leftX, y: cursorY, size: 10, font: sans, color: ink });

    // Bottom disclaimer
    const discY = 55;
    const line1a = 'This certificate confirms completion of the ';
    const line1bWidth = sansBold.widthOfTextAtSize(course.title, 9);
    page.drawText(line1a, { x: leftX, y: discY + 12, size: 9, font: sans, color: muted });
    const line1aWidth = sans.widthOfTextAtSize(line1a, 9);
    page.drawText(course.title, {
      x: leftX + line1aWidth,
      y: discY + 12,
      size: 9,
      font: sansBold,
      color: rose,
    });
    page.drawText(' course', {
      x: leftX + line1aWidth + line1bWidth,
      y: discY + 12,
      size: 9,
      font: sans,
      color: muted,
    });
    page.drawText('offered by SafeHaven. It does not confer academic credit or a professional qualification.', {
      x: leftX,
      y: discY,
      size: 9,
      font: sans,
      color: muted,
    });

    // ---------- Right ribbon ----------
    const ribbonWidth = 165;
    const ribbonX = width - 40 - ribbonWidth;
    const ribbonTopY = height - 20;
    const ribbonNotchY = 140;

    page.drawRectangle({
      x: ribbonX,
      y: ribbonNotchY,
      width: ribbonWidth,
      height: ribbonTopY - ribbonNotchY,
      color: blush,
    });
    // Triangular notch at the bottom of the ribbon
    page.drawSvgPath(
      `M0 0 L${ribbonWidth} 0 L${ribbonWidth / 2} 70 Z`,
      { x: ribbonX, y: ribbonNotchY, color: blush }
    );

    const centerX = ribbonX + ribbonWidth / 2;
    const centerRibbonText = (text, y, font, size, color) => {
      const w = font.widthOfTextAtSize(text, size);
      page.drawText(text, { x: centerX - w / 2, y, size, font, color });
    };

    centerRibbonText('COURSE', height - 75, sansBold, 14, roseDeep);
    centerRibbonText('CERTIFICATE', height - 92, sansBold, 14, roseDeep);
    page.drawLine({
      start: { x: centerX - 18, y: height - 104 },
      end: { x: centerX + 18, y: height - 104 },
      thickness: 1.5,
      color: rose,
    });

    // Circular seal with arced text
    const sealCenterY = height - 230;
    const sealRadius = 62;

    // dotted outer ring
    const dotCount = 40;
    for (let i = 0; i < dotCount; i++) {
      const angle = (i / dotCount) * Math.PI * 2;
      const dx = centerX + Math.cos(angle) * (sealRadius + 8);
      const dy = sealCenterY + Math.sin(angle) * (sealRadius + 8);
      page.drawCircle({ x: dx, y: dy, size: 0.8, color: rose });
    }
    page.drawCircle({
      x: centerX,
      y: sealCenterY,
      size: sealRadius,
      borderColor: rose,
      borderWidth: 1,
    });

    // Arced text helper
    const drawArcText = (text, radius, side, font, size, color) => {
      const chars = text.split('');
      const anglePerChar = 9;
      const spread = anglePerChar * (chars.length - 1);
      let angle;
      let angleStep;
      let rotationOffset;
      if (side === 'top') {
        angle = 90 + spread / 2;
        angleStep = -anglePerChar;
        rotationOffset = -90;
      } else {
        angle = -90 - spread / 2;
        angleStep = anglePerChar;
        rotationOffset = 90;
      }
      chars.forEach((ch) => {
        const rad = (angle * Math.PI) / 180;
        const x = centerX + Math.cos(rad) * radius;
        const y = sealCenterY + Math.sin(rad) * radius;
        const rotation = angle + rotationOffset;
        page.drawText(ch, {
          x,
          y,
          size,
          font,
          color,
          rotate: { type: 'degrees', angle: rotation },
        });
        angle += angleStep;
      });
    };

    drawArcText('BUILDING A WORLD', sealRadius - 8, 'top', sansBold, 7, roseDeep);
    drawArcText('FREE FROM GBV', sealRadius - 8, 'bottom', sansBold, 7, roseDeep);

    // Small heart + wordmark inside the seal
    page.drawSvgPath('M12 21c-4-3-10-7-10-13 a5 5 0 0 1 10-2 a5 5 0 0 1 10 2c0 6-6 10-10 13z', {
      x: centerX - 10,
      y: sealCenterY + 10,
      scale: 0.9,
      color: rose,
    });
    centerRibbonText('SafeHaven', sealCenterY - 12, sansBold, 11, plum);

    // ========== VERIFY + QR CODE + CERTIFICATE ID ==========
    centerRibbonText('Verify this certificate:', 190, sans, 9, ink);

    // QR Code placeholder box
    const qrSize = 60;
    const qrX = centerX - qrSize / 2;
    const qrY = 110;
    
    page.drawRectangle({
      x: qrX,
      y: qrY,
      width: qrSize,
      height: qrSize,
      borderColor: sand,
      borderWidth: 1,
      color: white,
    });

    // QR Code text
    page.drawText('Scan QR Code', {
      x: centerX - sans.widthOfTextAtSize('Scan QR Code', 7) / 2,
      y: qrY - 12,
      size: 7,
      font: sans,
      color: muted,
    });

    // Certificate ID below
    const idText = `ID: ${certificateId}`;
    const idWidth = sans.widthOfTextAtSize(idText, 7);
    page.drawText(idText, {
      x: centerX - idWidth / 2,
      y: 35,
      size: 7,
      font: sans,
      color: muted,
    });

    // Or visit text
    page.drawText('or visit: safehaven.org/certificates/verify', {
      x: centerX - sans.widthOfTextAtSize('or visit: safehaven.org/certificates/verify', 7) / 2,
      y: 22,
      size: 7,
      font: sans,
      color: muted,
    });

    // ========== EMBED QR CODE IMAGE ==========
    try {
      // Fetch QR code from API
      const fetch_import = await import('node-fetch');
      const fetch = fetch_import.default;
      
      const qrResponse = await fetch(qrCodeUrl);
      const qrBuffer = await qrResponse.buffer();
      const qrImage = await pdfDoc.embedPng(qrBuffer);
      
      page.drawImage(qrImage, {
        x: qrX + 2,
        y: qrY + 2,
        width: qrSize - 4,
        height: qrSize - 4,
      });
    } catch (qrErr) {
      console.warn('QR code embedding failed, continuing without it:', qrErr.message);
      // QR placeholder box still shows, just without the actual QR image
    }

    pdfBytes = await pdfDoc.save();
  } catch (buildErr) {
    console.error('Certificate PDF build error:', buildErr);
    return res.status(500).json({ error: 'Could not generate certificate PDF' });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${course.id}-certificate.pdf"`
  );
  return res.status(200).send(Buffer.from(pdfBytes));
}
